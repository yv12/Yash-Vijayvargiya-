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

import { useState } from "react";
import { Draw, useInView } from "./ui";
import { between, lenses, orbit } from "./content";

/* ------------------------------------------------------- the curve, ch. 02 */

/** Points sit on the cubic below. Do not move one without moving the other. */
const NODES = [
  { x: 110, y: 215 },
  { x: 324, y: 112 },
  { x: 576, y: 112 },
  { x: 790, y: 215 },
];

export function PathTimeline() {
  return (
    <figure className="mt-12">
      <Draw className="hidden sm:block">
        <svg
          viewBox="0 0 900 300"
          className="w-full"
          role="img"
          aria-label={between.path
            .map((s) => `${s.place}, ${s.role}, ${s.when}`)
            .join(". ")}
        >
          <path
            d="M110,215 C280,60 620,60 790,215"
            fill="none"
            stroke="#12151A"
            strokeWidth="1.5"
            style={{ ["--len" as string]: 900 }}
          />
          {NODES.map((n, i) => {
            const s = between.path[i];
            const above = n.y < 160;
            return (
              <g key={s.place}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="7"
                  fill="#EAECE7"
                  stroke={i === NODES.length - 1 ? "var(--accent)" : "#12151A"}
                  strokeWidth="2"
                  style={{ ["--len" as string]: 44 }}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="3"
                  fill={i === NODES.length - 1 ? "var(--accent)" : "#12151A"}
                  stroke="none"
                />
                <text
                  x={n.x}
                  y={above ? n.y - 44 : n.y + 40}
                  textAnchor="middle"
                  fill="#12151A"
                  fontSize="15"
                  fontFamily="Bricolage Grotesque, sans-serif"
                  fontWeight="600"
                >
                  {s.place}
                </text>
                <text
                  x={n.x}
                  y={above ? n.y - 26 : n.y + 58}
                  textAnchor="middle"
                  fill="#5F6873"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {s.role}
                </text>
                <text
                  x={n.x}
                  y={above ? n.y - 12 : n.y + 72}
                  textAnchor="middle"
                  fill="#5F6873"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {s.when}
                </text>
              </g>
            );
          })}
        </svg>
      </Draw>

      {/* same content, stacked, for narrow screens */}
      <ol className="border border-rule bg-white/55 sm:hidden">
        {between.path.map((s, i) => (
          <li key={s.place} className={`p-4 ${i > 0 ? "border-t border-rule" : ""}`}>
            <p className="tag">{s.when}</p>
            <p className="mt-1 font-display text-[19px] leading-tight">{s.place}</p>
            <p className="tag mt-1">{s.role}</p>
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
    <figure ref={ref} className="mt-14">
      <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
        <svg
          viewBox="0 0 520 460"
          className="w-full max-w-[420px] shrink-0"
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
              strokeWidth="1.5"
              strokeOpacity="0.7"
              style={{
                opacity: seen ? 1 : 0,
                transition: `opacity 400ms ease ${i * 120}ms`,
              }}
            />
          ))}

          <circle
            cx="260"
            cy="230"
            r="42"
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
            y="226"
            textAnchor="middle"
            fill="#EAECE7"
            fontSize="12"
            fontFamily="IBM Plex Mono, monospace"
          >
            Worth
          </text>
          <text
            x="260"
            y="242"
            textAnchor="middle"
            fill="#EAECE7"
            fontSize="12"
            fontFamily="IBM Plex Mono, monospace"
          >
            building
          </text>

          <text x="150" y="110" textAnchor="middle" fill="#A33726" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="600">
            User need
          </text>
          <text x="382" y="110" textAnchor="middle" fill="#1B3AC7" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="600">
            Business value
          </text>
          <text x="140" y="420" textAnchor="middle" fill="#1F5C58" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="600">
            Feasibility
          </text>
          <text x="392" y="420" textAnchor="middle" fill="#7A5716" fontSize="14" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="600">
            AI fit
          </text>
        </svg>

        <ul className="space-y-4">
          {lenses.items.map((l) => (
            <li key={l.name}>
              <p className="font-display text-[19px] leading-tight">{l.name}</p>
              <p className="text-[17px] text-graphite">{l.note}</p>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="measure mt-6 text-[17px] text-graphite">
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
        <ul className="mt-6 flex flex-wrap gap-2 md:sr-only">
          {orbit.rings.flat().map((sk) => (
            <li
              key={sk}
              className="rounded border border-[#EAECE7]/25 px-3 py-2 font-mono text-[12px]"
            >
              {sk}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
