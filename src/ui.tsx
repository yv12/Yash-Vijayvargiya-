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
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
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
 * Aesthetic 90s Tactile Hardware Button: authentic beveled keycap,
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
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:py-12 md:py-14 sm:px-8 lg:px-12 flex flex-col items-center text-center">

        <h2
          id={`${id}-title`}
          className="measure text-[22px] xs:text-[26px] sm:text-[28px] md:text-[32px] leading-[1.18] px-2"
        >
          {title}
        </h2>
        <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col items-center w-full">{children}</div>
      </div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="measure mt-4 sm:mt-4.5 first:mt-0 text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] text-[#16191E] text-center mx-auto px-1 sm:px-0">
      {children}
    </p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="measure mt-4 sm:mt-5 border-l-4 border-r-4 px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] leading-relaxed italic text-[#343B45] bg-paper/60 text-center mx-auto"
      style={{ borderColor: "var(--accent)" }}
    >
      {children}
    </p>
  );
}

/* --------------------------------------------------------- pull quote */

/** Editorial pull-quote: a visually distinct highlighted line from the chapter with optional scroll parallax. */
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
