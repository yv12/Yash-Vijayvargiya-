import type { FastifyInstance, FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { VALID_PROJECT_SLUGS } from "../src/content";

export interface ClickRecord {
  id: string;
  slug: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  referrer: string;
  timeOnPageMs: number;
  scrollDepthPct: number;
  viewport: string;
}

export function maskIp(ip: string): string {
  if (!ip) return "unknown";
  // Handle IPv4
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
  }
  // Handle IPv6
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 2) {
      return `${parts.slice(0, 3).join(":")}::xxx`;
    }
  }
  return "xxx.xxx.xxx.xxx";
}

export function getClientIp(req: FastifyRequest): string {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return xForwardedFor[0].split(",")[0].trim();
  }
  return req.ip || "127.0.0.1";
}

function safeTokenCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const bufProvided = Buffer.from(provided, "utf8");
  const bufExpected = Buffer.from(expected, "utf8");
  if (bufProvided.length !== bufExpected.length) {
    // Constant-time dummy check to prevent timing analysis on string length
    crypto.timingSafeEqual(bufProvided, bufProvided);
    return false;
  }
  return crypto.timingSafeEqual(bufProvided, bufExpected);
}

// In-memory rate limiter: IP -> { count, resetTime }
const adminRateLimits = new Map<string, { count: number; resetTime: number }>();

function checkAdminRateLimit(ip: string, limit = 10, windowMs = 3600000): boolean {
  const now = Date.now();
  const entry = adminRateLimits.get(ip);
  if (!entry || now > entry.resetTime) {
    adminRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  return true;
}

/**
 * Lazily prune records older than retention period if more than 24 hours have passed.
 */
export function checkAndPruneLogs(logPath: string, retentionDays: number) {
  try {
    const logDir = path.dirname(logPath);
    const sidecarPath = path.join(logDir, ".last-prune");
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    let shouldPrune = false;
    if (!fs.existsSync(sidecarPath)) {
      shouldPrune = true;
    } else {
      try {
        const stats = fs.statSync(sidecarPath);
        if (now - stats.mtimeMs > TWENTY_FOUR_HOURS) {
          shouldPrune = true;
        }
      } catch {
        shouldPrune = true;
      }
    }

    if (!shouldPrune || !fs.existsSync(logPath)) {
      return;
    }

    const cutoff = now - retentionDays * TWENTY_FOUR_HOURS;
    const content = fs.readFileSync(logPath, "utf8");
    const lines = content.split("\n").filter((line) => line.trim().length > 0);

    const retained: string[] = [];
    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        const recordTime = new Date(record.timestamp).getTime();
        if (recordTime >= cutoff) {
          retained.push(line);
        }
      } catch {
        // Discard malformed lines
      }
    }

    // Atomically rewrite retained lines
    const tempPath = `${logPath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, retained.length > 0 ? retained.join("\n") + "\n" : "", "utf8");
    fs.renameSync(tempPath, logPath);

    // Update sidecar timestamp
    fs.writeFileSync(sidecarPath, new Date().toISOString(), "utf8");
  } catch (err) {
    // Log to server console only, never fail visitor request
    console.error("[Tracking] Lazy prune failed:", err);
  }
}

export const trackingRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Support beacon text/plain payloads by parsing JSON safely
  fastify.addContentTypeParser(
    "text/plain",
    { parseAs: "string", bodyLimit: 2048 },
    (_req, body: string, done) => {
      try {
        if (!body || body.trim() === "") {
          done(null, {});
          return;
        }
        done(null, JSON.parse(body));
      } catch {
        // Malformed JSON is treated as empty object
        done(null, {});
      }
    }
  );

  // POST /api/click
  fastify.post(
    "/api/click",
    {
      config: {
        bodyLimit: 2048, // Reject bodies over 2KB
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = (req.body || {}) as Record<string, unknown>;
        const slug = typeof body.slug === "string" ? body.slug.trim() : "";

        // Validate slug against known project slugs from content.ts
        const isValidSlug = VALID_PROJECT_SLUGS.includes(slug as any);
        if (!isValidSlug) {
          // Unknown or invalid slug: respond 204, do not write
          return reply.code(204).send();
        }

        const logPath = process.env.CLICK_LOG_PATH || path.resolve(process.cwd(), "data/clicks.log");
        const logDir = path.dirname(logPath);
        const retentionDays = parseInt(process.env.CLICK_RETENTION_DAYS || "90", 10);

        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const rawIp = getClientIp(req);
        const masked = maskIp(rawIp);

        const record: ClickRecord = {
          id: crypto.randomUUID(),
          slug,
          timestamp: new Date().toISOString(),
          ip: masked,
          userAgent: (req.headers["user-agent"] as string) || "Unknown",
          referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "",
          timeOnPageMs: typeof body.timeOnPageMs === "number" ? Math.max(0, Math.round(body.timeOnPageMs)) : 0,
          scrollDepthPct:
            typeof body.scrollDepthPct === "number"
              ? Math.min(100, Math.max(0, Math.round(body.scrollDepthPct)))
              : 0,
          viewport: typeof body.viewport === "string" ? body.viewport.slice(0, 50) : "",
        };

        // Append one JSONL line wrapped in try/catch
        try {
          fs.appendFileSync(logPath, JSON.stringify(record) + "\n", "utf8");
          // Lazy prune check on each write
          checkAndPruneLogs(logPath, retentionDays);
        } catch (diskErr) {
          console.error("[Tracking] Failed to write click log:", diskErr);
        }
      } catch (err) {
        console.error("[Tracking] Unexpected error processing click:", err);
      }

      // Always respond 204 regardless of write success
      return reply.code(204).send();
    }
  );

  // GET /api/admin/data (JSON API for React dashboard)
  fastify.get(
    "/api/admin/data",
    async (
      req: FastifyRequest<{ Querystring: { token?: string } }>,
      reply: FastifyReply
    ) => {
      const clientIp = getClientIp(req);
      const authHeader = req.headers["authorization"] || "";
      const headerToken = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : (req.headers["x-admin-token"] as string) || "";
      const queryToken = req.query.token || headerToken;
      const expectedToken = process.env.ADMIN_TOKEN || "";

      // Rate limit check: 60 requests per hour for API dashboard
      if (!checkAdminRateLimit(clientIp, 60, 3600000)) {
        return reply.code(429).send({ error: "Too Many Requests" });
      }

      // Timing safe token check
      if (!expectedToken || !safeTokenCompare(queryToken, expectedToken)) {
        return reply.code(404).send({ error: "Not Found" });
      }

      const logPath = process.env.CLICK_LOG_PATH || path.resolve(process.cwd(), "data/clicks.log");
      const records: ClickRecord[] = [];

      if (fs.existsSync(logPath)) {
        try {
          const content = fs.readFileSync(logPath, "utf8");
          const lines = content.split("\n").filter((l) => l.trim().length > 0);
          for (const line of lines) {
            try {
              records.push(JSON.parse(line));
            } catch {
              // Ignore corrupt lines
            }
          }
        } catch (err) {
          console.error("[Tracking] Failed reading clicks.log for JSON API:", err);
        }
      }

      records.reverse();

      return reply.code(200).send({
        records,
        totalClicks: records.length,
        uniqueProjects: new Set(records.map((r) => r.slug)).size,
        uniqueVisitors: new Set(records.map((r) => r.ip)).size,
      });
    }
  );

  // GET /admin/clicks?token=...
  fastify.get(
    "/admin/clicks",
    async (req: FastifyRequest<{ Querystring: { token?: string } }>, reply: FastifyReply) => {
      const clientIp = getClientIp(req);
      const queryToken = req.query.token || "";
      const expectedToken = process.env.ADMIN_TOKEN || "";

      // Rate limit check: 10 requests per hour
      if (!checkAdminRateLimit(clientIp, 10, 3600000)) {
        return reply.code(429).header("Content-Type", "text/plain").send("Too Many Requests");
      }

      // Timing safe token check
      // Wrong or missing token: return 404 (don't confirm the route exists)
      if (!expectedToken || !safeTokenCompare(queryToken, expectedToken)) {
        return reply.code(404).header("Content-Type", "text/plain").send("Not Found");
      }

      // Read log entries
      const logPath = process.env.CLICK_LOG_PATH || path.resolve(process.cwd(), "data/clicks.log");
      const records: ClickRecord[] = [];

      if (fs.existsSync(logPath)) {
        try {
          const content = fs.readFileSync(logPath, "utf8");
          const lines = content.split("\n").filter((l) => l.trim().length > 0);
          for (const line of lines) {
            try {
              records.push(JSON.parse(line));
            } catch {
              // Ignore corrupt lines
            }
          }
        } catch (err) {
          console.error("[Tracking] Failed reading clicks.log for admin:", err);
        }
      }

      // Reverse chronological order
      records.reverse();

      // Render simple, crisp dashboard
      const rows = records
        .map((r) => {
          const dateStr = new Date(r.timestamp).toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " UTC";
          const secondsOnPage = (r.timeOnPageMs / 1000).toFixed(1);
          return `
            <tr>
              <td class="font-mono text-signal font-bold">${escapeHtml(r.slug)}</td>
              <td class="font-mono text-muted whitespace-nowrap">${escapeHtml(dateStr)}</td>
              <td class="font-mono">${escapeHtml(r.ip)}</td>
              <td class="text-sm truncate max-w-xs" title="${escapeHtml(r.userAgent)}">${escapeHtml(r.userAgent)}</td>
              <td class="font-mono text-sm">${escapeHtml(r.referrer || "direct")}</td>
              <td class="font-mono">${secondsOnPage}s</td>
              <td class="font-mono">${r.scrollDepthPct}%</td>
              <td class="font-mono text-muted">${escapeHtml(r.viewport || "-")}</td>
            </tr>
          `;
        })
        .join("\n");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Click Telemetry · Admin</title>
  <style>
    :root {
      --bg: #F5F2EC;
      --card-bg: #FFFFFF;
      --ink: #111110;
      --muted: #6B6860;
      --border: #DDD8CE;
      --signal: #1B3AC7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--ink);
      padding: 2.5rem 1.5rem;
      line-height: 1.5;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; }
    .meta { font-family: monospace; font-size: 0.85rem; color: var(--muted); }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 1.25rem;
      border-radius: 6px;
    }
    .stat-value { font-size: 2rem; font-weight: 700; font-family: monospace; color: var(--signal); }
    .stat-label { font-size: 0.8rem; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; margin-top: 0.25rem; }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
    th {
      background: #ECE7DE;
      padding: 0.75rem 1rem;
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover { background: #FAF8F5; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.82rem; }
    .text-signal { color: var(--signal); }
    .text-muted { color: var(--muted); }
    .truncate { max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; }
    .empty { padding: 3rem; text-align: center; color: var(--muted); font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>Project Clicks Telemetry</h1>
        <p class="meta">Server log at ${escapeHtml(logPath)} · Masked IPs · Append-only JSONL</p>
      </div>
      <div class="meta">${records.length} records total</div>
    </header>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${records.length}</div>
        <div class="stat-label">Total Clicks Logged</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${new Set(records.map((r) => r.slug)).size}</div>
        <div class="stat-label">Unique Projects Clicked</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${new Set(records.map((r) => r.ip)).size}</div>
        <div class="stat-label">Distinct Masked IPs</div>
      </div>
    </div>

    <div class="table-container">
      ${
        records.length === 0
          ? `<div class="empty">No clicks logged yet. Click "View live" on any project to record an event.</div>`
          : `<table>
              <thead>
                <tr>
                  <th>Project Slug</th>
                  <th>Timestamp (UTC)</th>
                  <th>Masked IP</th>
                  <th>User Agent</th>
                  <th>Referrer</th>
                  <th>Time On Page</th>
                  <th>Scroll Depth</th>
                  <th>Viewport</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>`
      }
    </div>
  </div>
</body>
</html>`;

      return reply.code(200).header("Content-Type", "text/html; charset=utf-8").send(html);
    }
  );
};

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
