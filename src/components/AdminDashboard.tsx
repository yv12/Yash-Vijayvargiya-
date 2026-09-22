import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

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

interface ApiResponse {
  records: ClickRecord[];
  totalClicks: number;
  uniqueProjects: number;
  uniqueVisitors: number;
}

export function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlToken = searchParams.get("token") || "";

  const [tokenInput, setTokenInput] = useState("");
  const [activeToken, setActiveToken] = useState<string>(() => {
    return urlToken || sessionStorage.getItem("admin_token") || "";
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "depth" | "time">("newest");

  const fetchData = async (token: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/data?token=${encodeURIComponent(token)}`);
      if (res.status === 404) {
        setError("Invalid admin token or unauthorized.");
        setData(null);
      } else if (res.status === 429) {
        setError("Rate limit exceeded. Please wait a few minutes before trying again.");
      } else if (!res.ok) {
        setError(`Server error (${res.status}). Ensure the Fastify backend is running.`);
      } else {
        const json: ApiResponse = await res.json();
        setData(json);
        sessionStorage.setItem("admin_token", token);
      }
    } catch {
      setError("Failed to connect to backend server. Make sure the server is started on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeToken) {
      fetchData(activeToken);
    }
  }, [activeToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const cleanToken = tokenInput.trim();
    setActiveToken(cleanToken);
    setSearchParams({ token: cleanToken });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setActiveToken("");
    setData(null);
    setSearchParams({});
  };

  // Aggregated Stats
  const stats = useMemo(() => {
    if (!data || !data.records.length) {
      return {
        totalClicks: 0,
        uniqueVisitors: 0,
        avgTimeOnPageSec: 0,
        avgScrollDepth: 0,
        slugCounts: {} as Record<string, number>,
        referrerCounts: {} as Record<string, number>,
        mobileCount: 0,
        desktopCount: 0,
      };
    }

    const records = data.records;
    const total = records.length;
    const totalTimeMs = records.reduce((acc, r) => acc + (r.timeOnPageMs || 0), 0);
    const totalDepth = records.reduce((acc, r) => acc + (r.scrollDepthPct || 0), 0);

    const slugCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    let mobileCount = 0;
    let desktopCount = 0;

    for (const r of records) {
      slugCounts[r.slug] = (slugCounts[r.slug] || 0) + 1;

      let refLabel = "Direct";
      if (r.referrer) {
        try {
          const url = new URL(r.referrer);
          refLabel = url.hostname.replace(/^www\./, "");
        } catch {
          refLabel = r.referrer.slice(0, 30);
        }
      }
      referrerCounts[refLabel] = (referrerCounts[refLabel] || 0) + 1;

      // Detect mobile vs desktop from viewport width
      const width = parseInt(r.viewport.split("x")[0] || "1024", 10);
      if (width < 768) {
        mobileCount++;
      } else {
        desktopCount++;
      }
    }

    return {
      totalClicks: total,
      uniqueVisitors: new Set(records.map((r) => r.ip)).size,
      avgTimeOnPageSec: Math.round((totalTimeMs / total / 1000) * 10) / 10,
      avgScrollDepth: Math.round(totalDepth / total),
      slugCounts,
      referrerCounts,
      mobileCount,
      desktopCount,
    };
  }, [data]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    if (!data?.records) return [];
    let list = [...data.records];

    if (selectedSlug !== "all") {
      list = list.filter((r) => r.slug === selectedSlug);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.slug.toLowerCase().includes(q) ||
          r.ip.toLowerCase().includes(q) ||
          r.userAgent.toLowerCase().includes(q) ||
          r.referrer.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sortBy === "depth") return b.scrollDepthPct - a.scrollDepthPct;
      if (sortBy === "time") return b.timeOnPageMs - a.timeOnPageMs;
      return 0;
    });

    return list;
  }, [data, selectedSlug, searchQuery, sortBy]);

  // CSV Export
  const exportCsv = () => {
    if (!filteredRecords.length) return;
    const headers = [
      "ID",
      "Project Slug",
      "Timestamp (UTC)",
      "Masked IP",
      "User Agent",
      "Referrer",
      "Time On Page (ms)",
      "Scroll Depth %",
      "Viewport",
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.slug,
      r.timestamp,
      r.ip,
      `"${r.userAgent.replace(/"/g, '""')}"`,
      `"${r.referrer.replace(/"/g, '""')}"`,
      r.timeOnPageMs,
      r.scrollDepthPct,
      r.viewport,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `click_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Password Screen
  if (!activeToken || (!data && error)) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-paper border border-rule p-8 rounded-lg shadow-xl text-left">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1B3AC7] animate-pulse" />
            <h1 className="text-[22px] font-display font-medium text-ink">
              Telemetry Dashboard
            </h1>
          </div>
          <p className="text-[14px] text-graphite mt-2">
            Enter your admin access token to view project click events and engagement metrics.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="token-input" className="font-mono text-[12px] uppercase text-graphite block mb-1.5">
                Admin Token
              </label>
              <input
                id="token-input"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter ADMIN_TOKEN..."
                className="w-full bg-white border border-rule px-3.5 py-2.5 font-mono text-[14px] rounded focus:outline-none focus:border-[#1B3AC7]"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-[#A33726]/10 border border-[#A33726]/30 text-[#A33726] text-[13px] rounded font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn py-2.5 text-[15px] font-medium tracking-wide justify-center"
            >
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-rule flex justify-between items-center text-[12px] font-mono text-graphite">
            <a href="/" className="hover:text-ink">
              ← Return to site
            </a>
            <span>Protected route</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Full Dashboard View
  return (
    <div className="min-h-screen bg-sand px-4 sm:px-8 py-12 text-ink">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-rule">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-[28px] font-display font-medium">Click Telemetry Analytics</h1>
              <span className="font-mono text-[11px] bg-white border border-rule px-2 py-0.5 rounded text-graphite">
                90-Day Append Log
              </span>
            </div>
            <p className="text-[14px] text-graphite mt-1">
              Private engagement data for &ldquo;View live&rdquo; project clicks. Zero cookies, masked IPs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchData(activeToken)}
              disabled={loading}
              className="btn py-1.5 px-3 text-[13px]"
            >
              {loading ? "Refreshing..." : "↻ Refresh Feed"}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredRecords.length}
              className="btn py-1.5 px-3 text-[13px]"
            >
              ↓ Export CSV
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="font-mono text-[13px] text-graphite hover:text-[#A33726] px-2 py-1 transition-colors"
            >
              Lock / Exit
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-paper border border-rule p-5 rounded-lg">
            <p className="font-mono text-[11px] uppercase tracking-wider text-graphite">Total Clicks</p>
            <p className="font-display text-[32px] font-bold text-[#1B3AC7] mt-1">
              {stats.totalClicks}
            </p>
            <p className="font-mono text-[12px] text-graphite mt-1">Recorded events</p>
          </div>

          <div className="bg-paper border border-rule p-5 rounded-lg">
            <p className="font-mono text-[11px] uppercase tracking-wider text-graphite">Unique Visitors</p>
            <p className="font-display text-[32px] font-bold text-[#1F5C58] mt-1">
              {stats.uniqueVisitors}
            </p>
            <p className="font-mono text-[12px] text-graphite mt-1">Distinct masked IPs</p>
          </div>

          <div className="bg-paper border border-rule p-5 rounded-lg">
            <p className="font-mono text-[11px] uppercase tracking-wider text-graphite">Avg. Time On Page</p>
            <p className="font-display text-[32px] font-bold text-[#7A5716] mt-1">
              {stats.avgTimeOnPageSec}s
            </p>
            <p className="font-mono text-[12px] text-graphite mt-1">Before clicking project</p>
          </div>

          <div className="bg-paper border border-rule p-5 rounded-lg">
            <p className="font-mono text-[11px] uppercase tracking-wider text-graphite">Avg. Scroll Depth</p>
            <p className="font-display text-[32px] font-bold text-[#A33726] mt-1">
              {stats.avgScrollDepth}%
            </p>
            <p className="font-mono text-[12px] text-graphite mt-1">Page depth reached</p>
          </div>
        </div>

        {/* Visual Breakdowns */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Projects Breakdown */}
          <div className="bg-paper border border-rule p-6 rounded-lg md:col-span-2">
            <h2 className="font-display text-[18px] font-medium mb-4">Clicks by Project</h2>
            {Object.keys(stats.slugCounts).length === 0 ? (
              <p className="text-graphite font-mono text-[13px]">No data recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.slugCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([slug, count]) => {
                    const pct = Math.round((count / stats.totalClicks) * 100);
                    return (
                      <div key={slug} className="space-y-1">
                        <div className="flex justify-between font-mono text-[13px]">
                          <span className="font-bold text-[#1B3AC7]">{slug}</span>
                          <span className="text-graphite">
                            {count} clicks ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-sand/60 rounded-full overflow-hidden border border-rule/50">
                          <div
                            className="h-full bg-[#1B3AC7] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Device & Referrers Card */}
          <div className="bg-paper border border-rule p-6 rounded-lg space-y-6">
            <div>
              <h2 className="font-display text-[18px] font-medium mb-3">Device Viewport</h2>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 border border-rule rounded bg-sand/20">
                  <p className="font-mono text-[11px] text-graphite uppercase">Desktop</p>
                  <p className="font-mono text-[20px] font-bold mt-0.5">{stats.desktopCount}</p>
                </div>
                <div className="p-3 border border-rule rounded bg-sand/20">
                  <p className="font-mono text-[11px] text-graphite uppercase">Mobile</p>
                  <p className="font-mono text-[20px] font-bold mt-0.5">{stats.mobileCount}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-[18px] font-medium mb-3">Top Referrers</h2>
              <div className="space-y-2">
                {Object.entries(stats.referrerCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([ref, count]) => (
                    <div key={ref} className="flex justify-between items-center text-[13px] font-mono border-b border-rule/50 pb-1">
                      <span className="truncate text-ink max-w-[180px]">{ref}</span>
                      <span className="text-[#1F5C58] font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feed / Table Section */}
        <div className="bg-paper border border-rule rounded-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[20px] font-medium">Click Event Ledger</h2>
              <p className="font-mono text-[12px] text-graphite">
                Showing {filteredRecords.length} of {data?.records.length || 0} events
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search slug, IP, referrer..."
                className="bg-white border border-rule px-3 py-1.5 font-mono text-[13px] rounded w-52 focus:outline-none focus:border-[#1B3AC7]"
              />

              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="bg-white border border-rule px-3 py-1.5 font-mono text-[13px] rounded focus:outline-none focus:border-[#1B3AC7]"
              >
                <option value="all">All Projects</option>
                {Object.keys(stats.slugCounts).map((slug) => (
                  <option key={slug} value={slug}>
                    {slug} ({stats.slugCounts[slug]})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-rule px-3 py-1.5 font-mono text-[13px] rounded focus:outline-none focus:border-[#1B3AC7]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="depth">Highest Scroll Depth</option>
                <option value="time">Longest Time on Page</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-rule rounded">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#ECE7DE] border-b border-rule font-mono text-[11px] uppercase tracking-wider text-graphite">
                <tr>
                  <th className="p-3">Project Slug</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Masked IP</th>
                  <th className="p-3">Time On Page</th>
                  <th className="p-3">Scroll Depth</th>
                  <th className="p-3">Referrer</th>
                  <th className="p-3">Viewport</th>
                  <th className="p-3">Device / User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-graphite font-mono">
                      No matching click events found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r) => {
                    const dateStr =
                      new Date(r.timestamp).toLocaleString("en-US", {
                        timeZone: "UTC",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }) + " UTC";
                    const seconds = (r.timeOnPageMs / 1000).toFixed(1);

                    return (
                      <tr key={r.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="p-3 font-mono font-bold text-[#1B3AC7]">
                          <span className="bg-[#1B3AC7]/10 px-2 py-0.5 rounded border border-[#1B3AC7]/20">
                            {r.slug}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-graphite whitespace-nowrap">{dateStr}</td>
                        <td className="p-3 font-mono text-ink">{r.ip}</td>
                        <td className="p-3 font-mono">{seconds}s</td>
                        <td className="p-3 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              r.scrollDepthPct >= 75
                                ? "bg-emerald-100 text-emerald-800"
                                : r.scrollDepthPct >= 40
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {r.scrollDepthPct}%
                          </span>
                        </td>
                        <td className="p-3 font-mono text-graphite truncate max-w-[140px]" title={r.referrer}>
                          {r.referrer || "direct"}
                        </td>
                        <td className="p-3 font-mono text-graphite">{r.viewport || "-"}</td>
                        <td className="p-3 text-[12px] text-graphite truncate max-w-[220px]" title={r.userAgent}>
                          {r.userAgent}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
