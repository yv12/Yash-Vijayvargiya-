import { useEffect, useRef, useState, type ReactNode } from "react";
import { chapters, TONE } from "./content";

import { trackProjectClick } from "./hooks/useClickTracking";

/* ------------------------------------------------------------ in view hook */

export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
          }
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, seen };
}

/** Wraps an SVG so its strokes draw themselves once, the first time it is seen. */
export function Draw({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`draw ${seen ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* --------------------------------------------------------- section header */

/**
 * Full-width orienting banner shown at the very top of each route.
 * Tells the user which mode they are in so they never feel lost mid-scroll.
 */
export function SectionHeader({
  label,
  meta: metaText,
  accent,
}: {
  label: string;
  meta: string;
  accent: string;
}) {
  return (
    <div
      className="section-header-band"
      style={{ borderColor: accent, "--sh-accent": accent } as React.CSSProperties}
    >
      <div className="mx-auto max-w-page px-4 sm:px-10 lg:px-16 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 sm:gap-3.5 pl-20 sm:pl-28 md:pl-32">
          <span
            className="section-header-dot"
            style={{ background: accent }}
          />
          <span className="section-header-label" style={{ color: accent }}>
            {label}
          </span>
        </div>
        <span className="section-header-meta text-[10px] sm:text-[11px] hidden xs:inline-block truncate max-w-[220px] sm:max-w-none">
          {metaText}
        </span>
      </div>
    </div>
  );
}

/**
 * Aesthetic 90s Tactile Hardware Button — authentic beveled keycap,
 * glowing phosphor status jewel LED lamp, mechanical press depth, and crisp monospace typography.
 * Attracts attention through tactile realism without being oversized.
 */
export function LaunchLink({
  href,
  children,
  accent = "#1B3AC7",
  size = "md",
  trackingSlug,
}: {
  href: string;
  children: ReactNode;
  accent?: string;
  size?: "sm" | "md" | "lg";
  trackingSlug?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "retro-btn-lg"
      : size === "sm"
      ? "retro-btn-sm"
      : "retro-btn-md";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        if (trackingSlug) {
          trackProjectClick(trackingSlug);
        }
      }}
      className={`retro-90s-btn ${sizeClass}`}
      style={
        {
          "--retro-accent": accent,
        } as React.CSSProperties
      }
    >
      {/* 90s Phosphor Jewel LED indicator */}
      <span className="retro-led-housing" aria-hidden="true">
        <span className="retro-led-core" />
      </span>

      {/* Button label */}
      <span className="retro-btn-text">{children}</span>

      {/* 90s Mechanical action arrow */}
      <span className="retro-btn-arrow" aria-hidden="true">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="retro-arrow-icon"
        >
          <path
            d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      </span>
    </a>
  );
}

/* --------------------------------------------------------------- chapter shell */

export function Chapter({
  id,
  title,
  children,
  variant,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  band?: boolean;
  variant?: "story" | "work" | "vision";
}) {
  const tone = TONE[chapters.find((c) => c.id === id)?.tone ?? "sand"];
  const variantClass = variant ? `chapter-variant-${variant}` : "";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-12 sm:scroll-mt-16 ${tone.bg} ${variantClass} relative overflow-hidden`}
      style={{ ["--accent" as string]: tone.accent }}
    >
      <div className="relative z-10 mx-auto max-w-page px-4 py-14 sm:px-10 md:py-28 lg:px-16 flex flex-col items-center text-center">

        <h2
          id={`${id}-title`}
          className="measure text-[26px] xs:text-[32px] sm:text-[40px] md:text-[48px] leading-[1.08] px-2"
        >
          {title}
        </h2>
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col items-center w-full">{children}</div>
      </div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="measure mt-5 sm:mt-6 first:mt-0 text-[17px] sm:text-[20px] leading-[1.72] text-[#16191E] text-center mx-auto px-1 sm:px-0">
      {children}
    </p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="measure mt-6 sm:mt-7 border-l-4 border-r-4 px-4 sm:px-6 py-3.5 sm:py-4 text-[16px] sm:text-[19px] leading-relaxed italic text-[#343B45] bg-paper/60 text-center mx-auto"
      style={{ borderColor: "var(--accent)" }}
    >
      {children}
    </p>
  );
}

/* --------------------------------------------------------- pull quote */

/** Editorial pull-quote — a visually distinct highlighted line from the chapter with optional scroll parallax. */
export function PullQuote({
  children,
  accent = "var(--accent)",
}: {
  children: ReactNode;
  accent?: string;
  parallax?: boolean;
}) {
  return (
    <blockquote
      className="pull-quote"
      style={
        {
          borderColor: accent,
        } as React.CSSProperties
      }
    >
      {children}
    </blockquote>
  );
}
