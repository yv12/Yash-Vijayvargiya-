import { useEffect, useRef, useCallback } from "react";

export interface ClickPayload {
  slug: string;
  referrer: string;
  timeOnPageMs: number;
  scrollDepthPct: number;
  viewport: string;
}

// Module-level tracking state so any component or direct call has access to accurate timing
let globalPageLoadTime: number = typeof window !== "undefined" ? Date.now() : 0;
let globalMaxScrollPct: number = 0;
const lastClickTimestamps: Map<string, number> = new Map();

function updateScrollDepth() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) {
    globalMaxScrollPct = 100;
    return;
  }
  const currentPct = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
  if (currentPct > globalMaxScrollPct) {
    globalMaxScrollPct = currentPct;
  }
}

// Attach window scroll listener once
if (typeof window !== "undefined") {
  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateScrollDepth();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  // Initial depth check
  updateScrollDepth();
}

/**
 * Fires a tracking beacon for a project click.
 * Debounces clicks to the same slug within 2000ms.
 * Never throws or blocks navigation.
 */
export function trackProjectClick(slug: string): void {
  try {
    if (!slug || typeof window === "undefined") return;

    const now = Date.now();
    const lastClick = lastClickTimestamps.get(slug) || 0;
    if (now - lastClick < 2000) {
      // Debounced: ignore repeated click within 2 seconds
      return;
    }
    lastClickTimestamps.set(slug, now);

    updateScrollDepth();

    const payload: ClickPayload = {
      slug,
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
      timeOnPageMs: Math.max(0, now - globalPageLoadTime),
      scrollDepthPct: globalMaxScrollPct,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };

    const serialized = JSON.stringify(payload);
    const endpoint = "/api/click";

    // Primary: navigator.sendBeacon
    let sent = false;
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      try {
        // Send as text/plain Blob or string to ensure standard beacon delivery
        const blob = new Blob([serialized], { type: "text/plain" });
        sent = navigator.sendBeacon(endpoint, blob);
      } catch {
        sent = false;
      }
    }

    // Fallback: fetch with keepalive: true
    if (!sent && typeof fetch === "function") {
      fetch(endpoint, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: serialized,
      }).catch(() => {
        // Silently ignore any network/fetch errors
      });
    }
  } catch {
    // Fail silently: never let tracking disrupt user experience
  }
}

/**
 * React hook that guarantees tracking initialization on mount and provides trackClick.
 */
export function useClickTracking() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      if (globalPageLoadTime === 0) {
        globalPageLoadTime = Date.now();
      }
      updateScrollDepth();
      isMounted.current = true;
    }
  }, []);

  const track = useCallback((slug: string) => {
    trackProjectClick(slug);
  }, []);

  return { trackClick: track };
}
