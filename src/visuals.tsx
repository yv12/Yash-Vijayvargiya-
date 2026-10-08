/**
 * Animated visual moments.
 *
 * House rules these follow:
 *  - motion that is not triggered by a person only runs once, on first entry,
 *    except the orbit, which a person can stop
 *  - nothing is revealed on hover alone, every label is always readable
 *  - prefers-reduced-motion turns all of it off and leaves the finished state
 *  - colour still only means "you can touch this", so the drawings stay in ink
 *    and hairline, with signal used on the one mark that carries the point
 */

import { Draw, useInView } from "./ui";
import { between, lenses, orbit } from "./content";

/* ------------------------------------------------------- the curve, ch. 02 */

/** Points sit on the cubic below. Do not move one without moving the other. */
const NODES = [
  { x: 90, y: 230 },
  { x: 330, y: 120 },
  { x: 610, y: 120 },
  { x: 850, y: 230 },
];

export function PathTimeline() {
  return (
    <figure className="mt-14 max-w-[840px] w-full mx-auto">
      <Draw className="hidden sm:block p-6 bg-paper border border-rule/70 rounded-2xl shadow-sm">
        <svg
          viewBox="0 0 940 330"
          className="w-full"
          role="img"
          aria-label={between.path
            .map((s) => `${s.place}, ${s.role}, ${s.when}`)
            .join(". ")}
        >
          {/* Timeline arc */}
          <path
            d="M90,230 C260,70 680,70 850,230"
            fill="none"
            stroke="#12151A"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ ["--len" as string]: 950 }}
          />
          {NODES.map((n, i) => {
            const s = between.path[i];
            const above = n.y < 160;
            return (
              <g key={s.place}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="11"
                  fill="#FFFFFF"
                  stroke={i === NODES.length - 1 ? "var(--accent)" : "#12151A"}
                  strokeWidth="3"
                  style={{ ["--len" as string]: 68 }}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="5"
                  fill={i === NODES.length - 1 ? "var(--accent)" : "#12151A"}
                  stroke="none"
                />
                <text
                  x={n.x}
                  y={above ? n.y - 52 : n.y + 44}
                  textAnchor="middle"
                  fill="#12151A"
                  fontSize="17"
                  fontFamily="Bricolage Grotesque, sans-serif"
                  fontWeight="700"
                >
                  {s.place}
                </text>
                <text
                  x={n.x}
                  y={above ? n.y - 32 : n.y + 66}
                  textAnchor="middle"
                  fill="#2A313C"
                  fontSize="13"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="500"
                >
                  {s.role}
                </text>
                <text
                  x={n.x}
                  y={above ? n.y - 14 : n.y + 84}
                  textAnchor="middle"
                  fill="#1B3AC7"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                >
                  {s.when}
                </text>
              </g>
            );
          })}
        </svg>
      </Draw>

      {/* same content, stacked, for narrow screens */}
      <ol className="border border-rule bg-paper rounded-xl p-2 sm:hidden divide-y divide-rule">
        {between.path.map((s) => (
          <li key={s.place} className="p-4">
            <span className="font-mono text-[12px] font-bold text-signal">{s.when}</span>
            <p className="mt-1 font-display text-[21px] font-semibold leading-tight text-ink">{s.place}</p>
            <p className="font-mono text-[13px] text-graphite mt-1">{s.role}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* ------------------------------------------------- pinned cards, ch. 02 */

const TILT = ["-1.4deg", "1.1deg", "-0.7deg"];
const CARD_EDGES = ["#A33726", "#7A5716", "#1F5C58"];

export function PinnedCards() {
  const { ref, seen } = useInView<HTMLUListElement>(0.2);

  return (
    <ul
      ref={ref}
      className="mt-14 grid gap-6 md:grid-cols-3"
      style={{ ["--card-tilt" as string]: "0deg" }}
    >
      {between.cards.map((c, i) => (
        <li
          key={c.stamp}
          className="relative border border-rule border-t-[3px] bg-white/55 p-6 transition-transform duration-300 ease-out hover:!rotate-0 focus-within:!rotate-0"
          style={{
            transform: seen ? `rotate(${TILT[i % TILT.length]})` : "rotate(0deg)",
            transitionDelay: `${i * 90}ms`,
            borderTopColor: CARD_EDGES[i % CARD_EDGES.length],
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -top-3 left-6 h-6 w-16 border border-rule bg-white/70"
          />
          <p className="tag text-signal">{c.stamp}</p>
          <h3 className="mt-3 text-[20px] leading-tight">{c.title}</h3>
          <p className="mt-3 text-[17px] text-graphite">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------- overlap lenses, ch. 06 */

const LENS_COLOURS = ["#A33726", "#1B3AC7", "#1F5C58", "#7A5716"];

const CIRCLES = [
  { cx: 200, cy: 175 },
  { cx: 320, cy: 175 },
  { cx: 200, cy: 285 },
  { cx: 320, cy: 285 },
];

export function Lenses() {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);

  return (
    <figure ref={ref} className="mt-14 max-w-[840px] w-full mx-auto p-6 sm:p-8 bg-paper border border-rule/70 rounded-2xl shadow-sm">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center justify-between">
        <svg
          viewBox="0 0 520 460"
          className="w-full max-w-[480px] shrink-0"
          role="img"
          aria-label={`Four overlapping lenses: ${lenses.items
            .map((l) => `${l.name}, ${l.note}`)
            .join("; ")}. Where all four meet: ${lenses.centre}.`}
        >
          {CIRCLES.map((c, i) => (
            <circle
              key={i}
              cx={c.cx}
              cy={c.cy}
              r="115"
              fill={LENS_COLOURS[i]}
              fillOpacity="0.12"
              stroke={LENS_COLOURS[i]}
              strokeWidth="2"
              strokeOpacity="0.75"
              style={{
                opacity: seen ? 1 : 0,
                transition: `opacity 400ms ease ${i * 120}ms`,
              }}
            />
          ))}

          <circle
            cx="260"
            cy="230"
            r="48"
            fill="var(--accent)"
            style={{
              opacity: seen ? 1 : 0,
              transform: seen ? "scale(1)" : "scale(0.7)",
              transformOrigin: "260px 230px",
              transition: "opacity 350ms ease 620ms, transform 350ms ease 620ms",
            }}
          />
          <text
            x="260"
            y="224"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
          >
            Worth
          </text>
          <text
            x="260"
            y="244"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="14"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
          >
            building
          </text>

          <text x="145" y="105" textAnchor="middle" fill="#A33726" fontSize="16" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700">
            User need
          </text>
          <text x="382" y="105" textAnchor="middle" fill="#1B3AC7" fontSize="16" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700">
            Business value
          </text>
          <text x="140" y="420" textAnchor="middle" fill="#1F5C58" fontSize="16" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700">
            Feasibility
          </text>
          <text x="392" y="420" textAnchor="middle" fill="#7A5716" fontSize="16" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="700">
            AI fit
          </text>
        </svg>

        <ul className="space-y-4 text-left">
          {lenses.items.map((l) => (
            <li key={l.name}>
              <p className="font-display text-[20px] font-semibold leading-tight text-ink">{l.name}</p>
              <p className="text-[17px] text-graphite leading-relaxed mt-0.5">{l.note}</p>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="measure mt-6 text-[17px] text-graphite text-center mx-auto">
        {lenses.caption}
      </figcaption>
    </figure>
  );
}

/* ---------------------------------------------------- the orbit, ch. 13 */

const RADII = [140, 205, 270];
const DURATIONS = [70, 100, 140];
const SIZES = [80, 70, 62];
const FILLS = ["#3A5BD9", "#B04430", "#2F6E6A", "#8B6B2E"];

export function SkillOrbit() {
  let seq = 0;

  return (
    <figure className="mt-14 border border-rule/60 rounded-lg bg-paper/40 backdrop-blur-sm">
      <div className="orbit-night px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h3 className="text-[26px] leading-tight text-ink">{orbit.title}</h3>
            <p className="mt-2 hidden font-mono text-[12px] text-graphite md:block">{orbit.note}</p>
          </div>
        </div>

        <div className="orbit-wrap mt-6">
          <div className="orbit-field" data-running="true">
            {RADII.map((r) => (
              <span
                key={r}
                className="orbit-track"
                style={{ width: r * 2, height: r * 2 }}
              />
            ))}

            <span className="orbit-centre">{orbit.centre}</span>

            {orbit.rings.map((ring, ri) => (
              <div
                key={ri}
                className="orbit-ring"
                style={{ ["--dur" as string]: `${DURATIONS[ri]}s` }}
              >
                {ring.map((label, i) => {
                  const angle = (360 / ring.length) * i;
                  const fill = FILLS[seq++ % FILLS.length];
                  return (
                    <span
                      key={label}
                      className="orbit-slot"
                      style={{
                        transform: `rotate(${angle}deg) translateX(${RADII[ri]}px)`,
                      }}
                    >
                      <span
                        className="orbit-node"
                        tabIndex={0}
                        style={{
                          ["--dur" as string]: `${DURATIONS[ri]}s`,
                          ["--angle" as string]: `${-angle}deg`,
                          ["--size" as string]: `${SIZES[ri]}px`,
                          ["--fill" as string]: fill,
                        }}
                      >
                        {label}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Below md the sky would be too small to read, so it does not run.
            Same skills, laid out flat, closest ring first. */}
        <ul className="mt-6 flex flex-wrap justify-center gap-2 md:sr-only">
          {orbit.rings.flat().map((sk) => (
            <li
              key={sk}
              className="rounded-full border border-rule/80 bg-paper/80 px-3.5 py-1.5 font-mono text-[12px] font-medium text-ink shadow-xs"
            >
              {sk}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
