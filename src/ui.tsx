import { useEffect, useRef, useState, type ReactNode } from "react";
import { chapters, TONE } from "./content";
import { useElementScrollProgress } from "./hooks/useScrollMotion";
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
      <div className="mx-auto max-w-page px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 pl-28 sm:pl-36">
          <span
            className="section-header-dot"
            style={{ background: accent }}
          />
          <span className="section-header-label" style={{ color: accent }}>
            {label}
          </span>
        </div>
        <span className="section-header-meta">{metaText}</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- launch link CTA */

/**
 * 2000s RGB Lights Live Launch Link — animated neon chromatic chase lights that grab attention.
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
      ? "launch-link-lg"
      : size === "sm"
      ? "launch-link-sm"
      : "launch-link-md";
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
      className={`launch-link launch-link-rgb ${sizeClass}`}
      style={
        {
          "--ll-accent": accent,
        } as React.CSSProperties
      }
    >
      {/* 2000s RGB chromatic aura border */}
      <span className="rgb-border-glow" aria-hidden="true" />
      {/* 2000s Pulsing RGB LED Indicator */}
      <span className="rgb-led-indicator" aria-hidden="true" />
      <span className="relative z-10 font-bold tracking-tight">{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="launch-link-icon relative z-10"
      >
        <path
          d="M2 12L12 2M12 2H6M12 2V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* 2000s glossy glass highlight */}
      <span className="rgb-gloss-sheen" aria-hidden="true" />
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
      className={`scroll-mt-16 ${tone.bg} ${variantClass} relative overflow-hidden`}
      style={{ ["--accent" as string]: tone.accent }}
    >
      <div className="relative z-10 mx-auto max-w-page px-6 py-20 sm:px-10 md:py-28 lg:px-16 flex flex-col items-center text-center">

        <h2
          id={`${id}-title`}
          className="measure text-[32px] sm:text-[40px] md:text-[48px]"
        >
          {title}
        </h2>
        <div className="mt-8 md:mt-10 flex flex-col items-center w-full">{children}</div>
      </div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="measure mt-6 first:mt-0 text-[19px] sm:text-[20px] leading-[1.75] text-[#16191E] text-center mx-auto">
      {children}
    </p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="measure mt-7 border-l-4 border-r-4 px-6 py-4 text-[18px] sm:text-[19px] leading-relaxed italic text-[#343B45] bg-paper/60 text-center mx-auto"
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
  parallax = true,
}: {
  children: ReactNode;
  accent?: string;
  parallax?: boolean;
}) {
  const { ref, progress } = useElementScrollProgress<HTMLQuoteElement>();
  const floatY = parallax ? Math.round(progress * -16) : 0;

  return (
    <blockquote
      ref={ref}
      className="pull-quote"
      style={
        {
          borderColor: accent,
          transform: parallax ? `translate3d(0, ${floatY}px, 0)` : undefined,
          willChange: parallax ? "transform" : undefined,
        } as React.CSSProperties
      }
    >
      {children}
    </blockquote>
  );
}
