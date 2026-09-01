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
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  band?: boolean;
}) {
  const tone = TONE[chapters.find((c) => c.id === id)?.tone ?? "sand"];
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-16 ${tone.bg}`}
      style={{ ["--accent" as string]: tone.accent }}
    >
      <div className="mx-auto max-w-page px-6 py-20 sm:px-10 md:py-28 lg:px-16 flex flex-col items-center text-center">

        <h2
          id={`${id}-title`}
          className="measure text-[30px] sm:text-[38px] md:text-[46px]"
        >
          {title}
        </h2>
        <div className="mt-8 md:mt-10 flex flex-col items-center w-full">{children}</div>
      </div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="measure mt-5 first:mt-0 text-center mx-auto">{children}</p>;
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="measure mt-5 border-l-2 border-r-2 px-4 text-[17px] italic text-graphite text-center mx-auto"
      style={{ borderColor: "var(--accent)" }}>
      {children}
    </p>
  );
}

