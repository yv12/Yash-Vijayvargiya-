import { useEffect, useRef, useState } from "react";

/**
 * Returns overall page scroll progress (0 to 1), current scrollY, and scroll direction.
 * Uses requestAnimationFrame and passive scroll listeners for maximum 60fps/120fps smoothness.
 */
export function useScrollProgress() {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    scrollY: 0,
    direction: "down" as "up" | "down",
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || 0;
          const totalHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress =
            totalHeight > 0 ? Math.min(1, Math.max(0, currentY / totalHeight)) : 0;
          const direction = currentY >= lastScrollY.current ? "down" : "up";

          lastScrollY.current = currentY;
          setScrollData({
            progress,
            scrollY: currentY,
            direction,
          });
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollData;
}

/**
 * Tracks an individual element's vertical position relative to the viewport.
 * - progress: -1 when element is entering at the bottom of the viewport
 *              0 when element center aligns with viewport center
 *             +1 when element is exiting at the top of the viewport
 * - inView: true when element is currently visible in viewport
 */
export function useElementScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if element is within viewport
      const isVisible = rect.bottom > 0 && rect.top < viewportHeight;
      setInView(isVisible);

      if (isVisible) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        // Normalized distance from viewport center: -1 (below) to +1 (above)
        const distFromCenter = (viewportCenter - elementCenter) / (viewportHeight / 2);
        // Clamp to [-1.5, 1.5]
        const clamped = Math.max(-1.5, Math.min(1.5, distFromCenter));
        setProgress(clamped);
      }
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          update();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { ref, progress, inView };
}
