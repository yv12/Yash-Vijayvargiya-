import { useEffect, useRef, useState, type ReactNode } from "react";
import { chapters, TONE } from "./content";

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

/* --------------------------------------------------------------- chapter shell */

export function Chapter({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  const tone = TONE[chapters.find((c) => c.id === id)?.tone ?? "sand"];
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 ${tone.bg}`}
      style={{ ["--accent" as string]: tone.accent }}
    >
      <div className="mx-auto max-w-page px-6 py-20 sm:px-10 md:py-28 lg:px-16">
        <p className="tag mb-6 flex items-center gap-3 accent">
          <span
            aria-hidden="true"
            className="block h-[3px] w-8"
            style={{ background: "var(--accent)" }}
          />
          Chapter {number}
        </p>
        <h2
          id={`${id}-title`}
          className="measure text-[30px] sm:text-[38px] md:text-[46px]"
        >
          {title}
        </h2>
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="measure mt-5 first:mt-0">{children}</p>;
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="measure mt-5 border-l-2 pl-4 text-[17px] italic text-graphite"
      style={{ borderColor: "var(--accent)" }}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------- the rail */

export function Rail() {
  const [active, setActive] = useState(chapters[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const index = Math.max(
    0,
    chapters.findIndex((c) => c.id === active)
  );

  return (
    <>
      {/* desktop rail */}
      <nav
        aria-label="Chapters"
        className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col gap-3">
          {chapters.map((c, i) => {
            const on = c.id === active;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? "true" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-px transition-all duration-200 ${
                      on
                        ? "w-8 bg-signal"
                        : i < index
                          ? "w-4 bg-graphite/60"
                          : "w-4 bg-rule"
                    }`}
                  />
                  <span
                    className={`tag whitespace-nowrap transition-opacity duration-150 ${
                      on
                        ? "opacity-100 text-ink"
                        : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {c.navLabel}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* always on: progress + quick routes */}
      <div className="fixed inset-x-0 top-0 z-40">
        <div
          aria-hidden="true"
          className="h-[2px] bg-signal transition-all duration-200"
          style={{ width: `${((index + 1) / chapters.length) * 100}%` }}
        />
        <div className="flex items-center justify-between bg-clay/80 px-5 py-2 backdrop-blur sm:px-8">
          <a href="#opening" className="tag text-ink">
            Yash Vijayvargiya
          </a>
          <div className="flex items-center gap-4">
            <a href="#build" className="tag text-signal">
              Work
            </a>
            <a href="#closing" className="tag text-signal">
              Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
