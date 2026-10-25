import { useState, useEffect, useMemo, Fragment } from "react";
import { useSearchParams } from "react-router-dom";

export interface ClickRecord {
  id: string;
  type?: "click" | "pageview" | "button";
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

export function formatSlug(slug: string): { label: string; type: "page" | "button" | "project" } {
  if (slug.startsWith("page:")) {
    const raw = slug.replace("page:", "");
    return { label: raw === "home" ? "Home (/)" : `/${raw}`, type: "page" };
  }
  if (slug.startsWith("btn:")) {
    const raw = slug.replace("btn:", "");
    const map: Record<string, string> = {
      linkedin: "LinkedIn",
      github: "GitHub",
      resume: "Resume PDF",
      whatsapp: "WhatsApp",
      "interview-me-whatsapp": "Interview Me (WhatsApp)",
      email: "Email (mailto)",
    };
    return { label: map[raw] || raw, type: "button" };
  }
  return { label: slug, type: "project" };
}

export function getDateKey(isoString: string): string {
  try {
    const d = new Date(isoString);
    // Use local calendar date so events correspond to the user's actual calendar day
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "Unknown Date";
  }
}

export function formatDateHeader(dateKey: string): string {
  if (dateKey === "Unknown Date") return dateKey;
  try {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const now = new Date();
    const todayY = now.getFullYear();
    const todayM = String(now.getMonth() + 1).padStart(2, "0");
    const todayD = String(now.getDate()).padStart(2, "0");
    const todayKey = `${todayY}-${todayM}-${todayD}`;

    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const yestY = yesterday.getFullYear();
    const yestM = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yestD = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayKey = `${yestY}-${yestM}-${yestD}`;

    const formatted = date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (dateKey === todayKey) {
      return `Today · ${formatted}`;
    }
    if (dateKey === yesterdayKey) {
      return `Yesterday · ${formatted}`;
    }
    return formatted;
  } catch {
    return dateKey;
  }
}

export function formatTime(isoString: string): { localTime: string; timeZoneName: string; utcTime: string } {
  try {
    const date = new Date(isoString);
    const localTime = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const timeZoneName =
      new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(date)
        .find((p) => p.type === "timeZoneName")?.value || "";

    const utcTime = date.toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return { localTime, timeZoneName, utcTime };
  } catch {
    return { localTime: isoString, timeZoneName: "", utcTime: "" };
  }
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
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | "pageview" | "button" | "click">("all");
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
        totalEvents: 0,
        pageViews: 0,
        buttonClicks: 0,
        projectClicks: 0,
        uniqueVisitors: 0,
        avgTimeOnPageSec: 0,
        avgScrollDepth: 0,
        slugCounts: {} as Record<string, number>,
        referrerCounts: {} as Record<string, number>,
        dailyList: [] as {
          dateKey: string;
          formattedDate: string;
          totalEvents: number;
          pageViews: number;
          buttonClicks: number;
          projectClicks: number;
          uniqueVisitors: number;
        }[],
        mobileCount: 0,
        desktopCount: 0,
      };
    }

    const records = data.records;
    const total = records.length;
    const pageViews = records.filter((r) => r.type === "pageview" || r.slug.startsWith("page:")).length;
    const buttonClicks = records.filter((r) => r.type === "button" || r.slug.startsWith("btn:")).length;
    const projectClicks = records.filter(
      (r) => !r.slug.startsWith("page:") && !r.slug.startsWith("btn:") && r.type !== "pageview" && r.type !== "button"
    ).length;

    const totalTimeMs = records.reduce((acc, r) => acc + (r.timeOnPageMs || 0), 0);
    const totalDepth = records.reduce((acc, r) => acc + (r.scrollDepthPct || 0), 0);

    const slugCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    const dailyMap: Record<
      string,
      {
        dateKey: string;
        totalEvents: number;
        pageViews: number;
        buttonClicks: number;
        projectClicks: number;
        visitors: Set<string>;
      }
    > = {};
    let mobileCount = 0;
    let desktopCount = 0;

    for (const r of records) {
      slugCounts[r.slug] = (slugCounts[r.slug] || 0) + 1;

      // Group by date
      const dateKey = getDateKey(r.timestamp);
      if (!dailyMap[dateKey]) {
        dailyMap[dateKey] = {
          dateKey,
          totalEvents: 0,
          pageViews: 0,
          buttonClicks: 0,
          projectClicks: 0,
          visitors: new Set(),
        };
      }
      const dayEntry = dailyMap[dateKey];
      dayEntry.totalEvents++;
      dayEntry.visitors.add(r.ip);
      if (r.type === "pageview" || r.slug.startsWith("page:")) {
        dayEntry.pageViews++;
      } else if (r.type === "button" || r.slug.startsWith("btn:")) {
        dayEntry.buttonClicks++;
      } else {
        dayEntry.projectClicks++;
      }

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

    const dailyList = Object.values(dailyMap)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .map((d) => ({
        dateKey: d.dateKey,
        formattedDate: formatDateHeader(d.dateKey),
        totalEvents: d.totalEvents,
        pageViews: d.pageViews,
        buttonClicks: d.buttonClicks,
        projectClicks: d.projectClicks,
        uniqueVisitors: d.visitors.size,
      }));

    return {
      totalEvents: total,
      pageViews,
      buttonClicks,
      projectClicks,
      uniqueVisitors: new Set(records.map((r) => r.ip)).size,
      avgTimeOnPageSec: Math.round((totalTimeMs / total / 1000) * 10) / 10,
      avgScrollDepth: Math.round(totalDepth / total),
      slugCounts,
      referrerCounts,
      dailyList,
      mobileCount,
      desktopCount,
    };
  }, [data]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    if (!data?.records) return [];
    let list = [...data.records];

    if (eventTypeFilter === "pageview") {
      list = list.filter((r) => r.type === "pageview" || r.slug.startsWith("page:"));
    } else if (eventTypeFilter === "button") {
      list = list.filter((r) => r.type === "button" || r.slug.startsWith("btn:"));
    } else if (eventTypeFilter === "click") {
      list = list.filter(
        (r) => !r.slug.startsWith("page:") && !r.slug.startsWith("btn:") && r.type !== "pageview" && r.type !== "button"
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      if (dateFilter === "today") {
        const todayKey = getDateKey(now.toISOString());
        list = list.filter((r) => getDateKey(r.timestamp) === todayKey);
      } else if (dateFilter === "7d") {
        const cutoff = now.getTime() - 7 * 86400000;
        list = list.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
      } else if (dateFilter === "30d") {
        const cutoff = now.getTime() - 30 * 86400000;
        list = list.filter((r) => new Date(r.timestamp).getTime() >= cutoff);
      } else {
        list = list.filter((r) => getDateKey(r.timestamp) === dateFilter);
      }
    }

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
  }, [data, eventTypeFilter, dateFilter, selectedSlug, searchQuery, sortBy]);

  // Group filtered records date-wise
  const groupedByDate = useMemo(() => {
    const map = new Map<string, ClickRecord[]>();
    for (const r of filteredRecords) {
      const key = getDateKey(r.timestamp);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(r);
    }
    const result: { dateKey: string; label: string; records: ClickRecord[] }[] = [];
    for (const [key, records] of map.entries()) {
      result.push({
        dateKey: key,
        label: formatDateHeader(key),
        records,
      });
    }
    return result;
  }, [filteredRecords]);

  // CSV Export
  const exportCsv = () => {
    if (!filteredRecords.length) return;
    const headers = [
      "ID",
      "Event Type",
      "Target / Slug",
      "Timestamp (UTC)",
      "Masked IP",
      "User Agent",
      "Referrer",
      "Time On Page (ms)",
      "Scroll Depth %",
      "Viewport",
    ];
    const rows = filteredRecords.map((r) => {
      const isPage = r.type === "pageview" || r.slug.startsWith("page:");
      const isButton = r.type === "button" || r.slug.startsWith("btn:");
      const eventType = isPage ? "Page View" : isButton ? "Button Click" : "Project Click";
      return [
        r.id,
        eventType,
        r.slug,
        r.timestamp,
        r.ip,
        `"${r.userAgent.replace(/"/g, '""')}"`,
        `"${r.referrer.replace(/"/g, '""')}"`,
        r.timeOnPageMs,
        r.scrollDepthPct,
        r.viewport,
      ];
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `telemetry_export_${Date.now()}.csv`);
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
            Enter your admin access token to view visitor analytics, page views, and project clicks.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="token-input" className="font-display text-[12px] uppercase font-semibold text-graphite block mb-1.5">
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
              <div className="p-3 bg-[#A33726]/10 border border-[#A33726]/30 text-[#A33726] text-[13px] rounded font-body">
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

          <div className="mt-6 pt-4 border-t border-rule flex justify-between items-center text-[12px] font-display text-graphite">
            <a href="/" className="hover:text-ink">
              Return to site
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
              <h1 className="text-[28px] font-display font-medium">Visitor & Click Telemetry</h1>
              <span className="font-display text-[11px] font-medium bg-white border border-rule px-2 py-0.5 rounded text-graphite">
                90-Day Append Log
              </span>
            </div>
            <p className="text-[14px] text-graphite mt-1">
              Private telemetry tracking live visitors, page views, and project clicks. Zero cookies, masked IPs.
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
              className="font-display text-[13px] font-medium text-graphite hover:text-[#A33726] px-2 py-1 transition-colors"
            >
              Lock / Exit
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Unique Visitors</p>
            <p className="font-display text-[26px] font-bold text-[#1F5C58] mt-1">
              {stats.uniqueVisitors}
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">Masked IPs</p>
          </div>

          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Page Views</p>
            <p className="font-display text-[26px] font-bold text-emerald-600 mt-1">
              {stats.pageViews}
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">All page visits</p>
          </div>

          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Button Clicks</p>
            <p className="font-display text-[26px] font-bold text-purple-600 mt-1">
              {stats.buttonClicks}
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">LinkedIn / Resume / GitHub</p>
          </div>

          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Project Clicks</p>
            <p className="font-display text-[26px] font-bold text-[#1B3AC7] mt-1">
              {stats.projectClicks}
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">&ldquo;View live&rdquo; links</p>
          </div>

          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Avg. Time</p>
            <p className="font-display text-[26px] font-bold text-[#7A5716] mt-1">
              {stats.avgTimeOnPageSec}s
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">On page duration</p>
          </div>

          <div className="bg-paper border border-rule p-4 rounded-lg">
            <p className="font-display text-[10px] uppercase tracking-wider font-semibold text-graphite">Avg. Scroll</p>
            <p className="font-display text-[26px] font-bold text-[#A33726] mt-1">
              {stats.avgScrollDepth}%
            </p>
            <p className="font-body text-[11px] text-graphite mt-0.5">Scroll depth</p>
          </div>
        </div>

        {/* Visual Breakdowns */}
        <div className="space-y-6">
          {/* Daily Activity Timeline */}
          <div className="bg-paper border border-rule p-6 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[18px]">📅</span>
                <h2 className="font-display text-[18px] font-medium">Daily Activity Timeline</h2>
                <span className="font-mono text-[11px] bg-sand px-2 py-0.5 rounded text-graphite border border-rule">
                  {stats.dailyList.length} active date(s)
                </span>
              </div>
              <div className="text-[12px] font-mono text-graphite">
                Click any date card to filter activity below
              </div>
            </div>

            {stats.dailyList.length === 0 ? (
              <p className="text-graphite font-mono text-[13px]">No daily activity recorded yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.dailyList.map((d) => {
                  const isSelected = dateFilter === d.dateKey;
                  const pct = Math.round((d.totalEvents / (stats.totalEvents || 1)) * 100);
                  return (
                    <button
                      key={d.dateKey}
                      type="button"
                      onClick={() => setDateFilter(isSelected ? "all" : d.dateKey)}
                      className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1B3AC7]/10 border-[#1B3AC7] ring-1 ring-[#1B3AC7] shadow-sm"
                          : "bg-white border-rule hover:border-graphite/40"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="font-display text-[13px] font-semibold text-ink">{d.formattedDate}</span>
                        <span className="font-mono text-[12px] font-bold text-[#1B3AC7]">{d.totalEvents} evt</span>
                      </div>
                      <div className="w-full h-1.5 bg-sand/60 rounded-full overflow-hidden mb-2.5">
                        <div className="h-full bg-[#1B3AC7] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-graphite">
                        <span><strong>{d.uniqueVisitors}</strong> visitor(s)</span>
                        <span>•</span>
                        <span className="text-emerald-700"><strong>{d.pageViews}</strong> visits</span>
                        <span>•</span>
                        <span className="text-purple-700"><strong>{d.buttonClicks}</strong> btns</span>
                        <span>•</span>
                        <span className="text-blue-700"><strong>{d.projectClicks}</strong> proj</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Targets Breakdown */}
            <div className="bg-paper border border-rule p-6 rounded-lg md:col-span-2">
              <h2 className="font-display text-[18px] font-medium mb-4">Traffic by Page, Button & Project</h2>
              {Object.keys(stats.slugCounts).length === 0 ? (
                <p className="text-graphite font-mono text-[13px]">No data recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.slugCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([slug, count]) => {
                      const info = formatSlug(slug);
                      const pct = Math.round((count / (stats.totalEvents || 1)) * 100);
                      return (
                        <div key={slug} className="space-y-1">
                          <div className="flex justify-between items-center font-mono text-[13px]">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                                  info.type === "page"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : info.type === "button"
                                    ? "bg-purple-100 text-purple-800 border border-purple-300"
                                    : "bg-blue-100 text-blue-800 border border-blue-300"
                                }`}
                              >
                                {info.type}
                              </span>
                              <span className="font-bold text-ink">
                                {info.label}
                              </span>
                            </div>
                            <span className="text-graphite">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-sand/60 rounded-full overflow-hidden border border-rule/50">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                info.type === "page"
                                  ? "bg-emerald-600"
                                  : info.type === "button"
                                  ? "bg-purple-600"
                                  : "bg-[#1B3AC7]"
                              }`}
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
                  {Object.entries(stats.referrerCounts).length === 0 ? (
                    <p className="text-[12px] text-graphite font-mono">No referrers yet.</p>
                  ) : (
                    Object.entries(stats.referrerCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([ref, count]) => (
                        <div key={ref} className="flex justify-between items-center text-[13px] font-mono border-b border-rule/50 pb-1">
                          <span className="truncate text-ink max-w-[180px]">{ref}</span>
                          <span className="text-[#1F5C58] font-semibold">{count}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feed / Table Section */}
        <div className="bg-paper border border-rule rounded-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[20px] font-medium">Activity Ledger</h2>
              <p className="font-body text-[12px] text-graphite">
                Showing {filteredRecords.length} of {data?.records.length || 0} recorded events across {groupedByDate.length} date category/categories
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Event Type Filter Tabs */}
              <div className="inline-flex bg-white border border-rule rounded p-0.5 text-[12px] font-mono">
                <button
                  type="button"
                  onClick={() => setEventTypeFilter("all")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventTypeFilter === "all"
                      ? "bg-[#1B3AC7] text-white font-semibold"
                      : "text-graphite hover:text-ink"
                  }`}
                >
                  All ({stats.totalEvents})
                </button>
                <button
                  type="button"
                  onClick={() => setEventTypeFilter("pageview")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventTypeFilter === "pageview"
                      ? "bg-emerald-600 text-white font-semibold"
                      : "text-graphite hover:text-ink"
                  }`}
                >
                  Visits ({stats.pageViews})
                </button>
                <button
                  type="button"
                  onClick={() => setEventTypeFilter("button")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventTypeFilter === "button"
                      ? "bg-purple-600 text-white font-semibold"
                      : "text-graphite hover:text-ink"
                  }`}
                >
                  Buttons ({stats.buttonClicks})
                </button>
                <button
                  type="button"
                  onClick={() => setEventTypeFilter("click")}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    eventTypeFilter === "click"
                      ? "bg-[#1B3AC7] text-white font-semibold"
                      : "text-graphite hover:text-ink"
                  }`}
                >
                  Projects ({stats.projectClicks})
                </button>
              </div>

              {/* Date Filter Dropdown */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white border border-rule px-2.5 py-1 font-mono text-[12px] rounded focus:outline-none focus:border-[#1B3AC7]"
              >
                <option value="all">📅 All Dates</option>
                <option value="today">📅 Today</option>
                <option value="7d">📅 Last 7 Days</option>
                <option value="30d">📅 Last 30 Days</option>
                {stats.dailyList.length > 0 && (
                  <optgroup label="Specific Date">
                    {stats.dailyList.map((d) => (
                      <option key={d.dateKey} value={d.dateKey}>
                        {d.formattedDate} ({d.totalEvents})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search page, button, IP..."
                className="bg-white border border-rule px-3 py-1 font-mono text-[12px] rounded w-44 focus:outline-none focus:border-[#1B3AC7]"
              />

              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="bg-white border border-rule px-2.5 py-1 font-mono text-[12px] rounded focus:outline-none focus:border-[#1B3AC7]"
              >
                <option value="all">All Targets</option>
                {Object.keys(stats.slugCounts).map((slug) => {
                  const info = formatSlug(slug);
                  return (
                    <option key={slug} value={slug}>
                      [{info.type.toUpperCase()}] {info.label} ({stats.slugCounts[slug]})
                    </option>
                  );
                })}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-rule px-2.5 py-1 font-mono text-[12px] rounded focus:outline-none focus:border-[#1B3AC7]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="depth">Scroll Depth</option>
                <option value="time">Time on Page</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-rule rounded">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#ECE7DE] border-b border-rule font-display font-semibold text-[11px] uppercase tracking-wider text-graphite">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Target / Action</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Masked IP</th>
                  <th className="p-3">Time On Page</th>
                  <th className="p-3">Scroll Depth</th>
                  <th className="p-3">Referrer</th>
                  <th className="p-3">Viewport</th>
                  <th className="p-3">Device / User Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {groupedByDate.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-graphite font-mono">
                      No matching activity events found.
                    </td>
                  </tr>
                ) : (
                  groupedByDate.map((group) => {
                    const uniqueGroupVisitors = new Set(group.records.map((r) => r.ip)).size;
                    const groupVisits = group.records.filter((r) => r.type === "pageview" || r.slug.startsWith("page:")).length;
                    const groupButtons = group.records.filter((r) => r.type === "button" || r.slug.startsWith("btn:")).length;
                    const groupProjects = group.records.filter(
                      (r) => !r.slug.startsWith("page:") && !r.slug.startsWith("btn:") && r.type !== "pageview" && r.type !== "button"
                    ).length;

                    return (
                      <Fragment key={group.dateKey}>
                        {/* Date Category Separator Row */}
                        <tr className="bg-[#ECE7DE]/90 border-y-2 border-rule">
                          <td colSpan={9} className="py-2 px-3 font-mono">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-1.5 font-display text-[13px] font-bold text-ink">
                                <span>📅</span>
                                <span>{group.label}</span>
                              </span>
                              <div className="flex items-center gap-2.5 text-[11px] font-mono text-graphite">
                                <span><strong>{group.records.length}</strong> events</span>
                                <span>•</span>
                                <span><strong>{uniqueGroupVisitors}</strong> visitor(s)</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">{groupVisits} visits</span>
                                <span>•</span>
                                <span className="text-purple-700 font-semibold">{groupButtons} buttons</span>
                                <span>•</span>
                                <span className="text-blue-700 font-semibold">{groupProjects} projects</span>
                              </div>
                            </div>
                          </td>
                        </tr>

                        {/* Events on this date */}
                        {group.records.map((r) => {
                          const info = formatSlug(r.slug);
                          const { localTime, timeZoneName, utcTime } = formatTime(r.timestamp);
                          const seconds = (r.timeOnPageMs / 1000).toFixed(1);

                          return (
                            <tr key={r.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="p-3 font-mono">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    info.type === "page"
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      : info.type === "button"
                                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                                      : "bg-blue-100 text-blue-800 border border-blue-300"
                                  }`}
                                >
                                  {info.type === "page" ? "Page Visit" : info.type === "button" ? "Button Click" : "Project Click"}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-ink">
                                {info.type === "page" ? (
                                  <span className="text-emerald-900 font-semibold">{info.label}</span>
                                ) : info.type === "button" ? (
                                  <span className="text-purple-900 font-semibold">{info.label}</span>
                                ) : (
                                  <span className="text-[#1B3AC7]">{info.label}</span>
                                )}
                              </td>
                              <td className="p-3 font-mono whitespace-nowrap">
                                <div className="text-ink font-semibold flex items-center gap-1.5">
                                  <span>{localTime}</span>
                                  {timeZoneName && (
                                    <span className="text-[10px] px-1.5 py-0.2 bg-[#ECE7DE] text-graphite font-medium rounded">
                                      {timeZoneName}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-graphite/60 mt-0.5">
                                  {utcTime} UTC
                                </div>
                              </td>
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
                        })}
                      </Fragment>
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
