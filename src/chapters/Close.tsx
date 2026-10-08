import { Chapter, Note, P, SectionHeader } from "../ui";
import { SkillOrbit } from "../visuals";
import { chapters, direction, skills, systems } from "../content";
import { useElementScrollProgress } from "../hooks/useScrollMotion";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ vision celestial drift */

export function VisionCelestialDrift() {
  return (
    <div className="vision-drift-layer" aria-hidden="true">
      <div className="vision-drift-orb vision-drift-orb-1" />
      <div className="vision-drift-orb vision-drift-orb-2" />
    </div>
  );
}

/* ------------------------------------------------------------------ vision section header */

export function VisionHeader() {
  return (
    <>
      <VisionCelestialDrift />
      <SectionHeader
        label="Vision"
        meta="Systems thinking + what I want to own next"
        accent="#1F5C58"
      />
    </>
  );
}

/* ------------------------------------------------------------------ circular loop diagram */

const LOOP_STEPS = direction.loop;
const LOOP_ACCENT = "#1F5C58";
const LOOP_CX = 220;
const LOOP_CY = 220;
const LOOP_R = 152;

function CircularLoop() {
  const { ref, progress } = useElementScrollProgress<HTMLDivElement>();
  const n = LOOP_STEPS.length;
  // Dynamic gyroscopic rotation: track rotates with scroll position
  const rotationDeg = Math.round(progress * 65);

  return (
    <figure
      ref={ref}
      className="vision-loop-wrap"
      aria-label={`The product loop: ${LOOP_STEPS.join(", ")}, and back to the start.`}
    >
      <svg
        viewBox="0 0 440 440"
        className="vision-loop-svg"
        role="img"
        aria-hidden="true"
      >
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill={LOOP_ACCENT} fillOpacity="0.65" />
          </marker>
        </defs>

        {/* Gyroscopic rotating group */}
        <g
          style={{
            transformOrigin: `${LOOP_CX}px ${LOOP_CY}px`,
            transform: `rotate(${rotationDeg}deg)`,
            transition: "transform 60ms linear",
          }}
        >
          {/* Dashed circle track */}
          <circle
            cx={LOOP_CX}
            cy={LOOP_CY}
            r={LOOP_R}
            fill="none"
            stroke={LOOP_ACCENT}
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeOpacity="0.35"
          />

          {/* Curved arrows between steps */}
          {LOOP_STEPS.map((_, i) => {
            const angle = (360 / n) * i - 90;
            const nextAngle = (360 / n) * ((i + 1) % n) - 90;
            const toRad = (d: number) => (d * Math.PI) / 180;
            const x1 = LOOP_CX + LOOP_R * Math.cos(toRad(angle));
            const y1 = LOOP_CY + LOOP_R * Math.sin(toRad(angle));
            const x2 = LOOP_CX + LOOP_R * Math.cos(toRad(nextAngle));
            const y2 = LOOP_CY + LOOP_R * Math.sin(toRad(nextAngle));
            const sweep = nextAngle > angle ? 1 : 0;
            return (
              <path
                key={i}
                d={`M${x1.toFixed(1)},${y1.toFixed(1)} A${LOOP_R},${LOOP_R} 0 0,${sweep} ${x2.toFixed(1)},${y2.toFixed(1)}`}
                fill="none"
                stroke={LOOP_ACCENT}
                strokeWidth="2"
                strokeOpacity="0.5"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Step nodes with local counter-rotation so text stays upright */}
          {LOOP_STEPS.map((step, i) => {
            const angle = (360 / n) * i - 90;
            const toRad = (d: number) => (d * Math.PI) / 180;
            const x = LOOP_CX + LOOP_R * Math.cos(toRad(angle));
            const y = LOOP_CY + LOOP_R * Math.sin(toRad(angle));
            const isFirst = i === 0;
            return (
              <g
                key={step}
                style={{
                  transformOrigin: `${x}px ${y}px`,
                  transform: `rotate(${-rotationDeg}deg)`,
                  transition: "transform 60ms linear",
                }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="34"
                  fill={isFirst ? LOOP_ACCENT : "rgba(255,255,255,0.96)"}
                  stroke={LOOP_ACCENT}
                  strokeWidth={isFirst ? 0 : 2}
                  strokeOpacity="0.75"
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isFirst ? "#fff" : LOOP_ACCENT}
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  letterSpacing="-0.01em"
                >
                  {step}
                </text>
              </g>
            );
          })}
        </g>

        {/* Fixed centre label */}
        <text
          x={LOOP_CX}
          y={LOOP_CY - 8}
          textAnchor="middle"
          fill="#5F6873"
          fontSize="13"
          fontFamily="IBM Plex Mono, monospace"
          fontWeight="600"
        >
          Own the
        </text>
        <text
          x={LOOP_CX}
          y={LOOP_CY + 12}
          textAnchor="middle"
          fill="#12151A"
          fontSize="16"
          fontFamily="Bricolage Grotesque, sans-serif"
          fontWeight="700"
        >
          FULL LOOP
        </text>
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------------ ch. 12 */

export function Systems() {
  const c = ch("systems");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} variant="vision">
      {systems.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
        {systems.flow.map((node, i) => (
          <li key={node} className="flex items-center gap-3">
            <span className="border border-[#1F5C58]/40 bg-[#1F5C58]/08 px-3 py-2 font-mono text-[12px] text-[#1F5C58]">
              {node}
            </span>
            {i < systems.flow.length - 1 && (
              <span aria-hidden="true" className="block h-px w-4 bg-[#1F5C58]/30" />
            )}
          </li>
        ))}
      </ol>
      <p className="tag mt-3">{systems.flowNote}</p>

      <div className="mt-12 max-w-[720px] border border-rule bg-paper w-full">
        <div className="border-b border-rule p-6 text-left">
          <h3 className="text-[21px] leading-tight">{systems.onboarding.title}</h3>
          <p className="tag mt-3 text-signal">Trigger</p>
          <p className="mt-1 font-mono text-[14px]">{systems.onboarding.trigger}</p>
        </div>
        <ul className="grid gap-px bg-rule sm:grid-cols-2">
          {systems.onboarding.steps.map((s) => (
            <li key={s} className="bg-paper p-5 font-mono text-[13px] text-left">
              {s}
            </li>
          ))}
        </ul>
        <p className="tag border-t border-rule p-5 text-left">{systems.onboarding.note}</p>
      </div>

      <Note>{systems.lesson}</Note>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 13 */

export function Direction() {
  const c = ch("direction");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band variant="vision">
      {direction.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      {/* Circular loop diagram — the main visual hero of Vision */}
      <CircularLoop />
      <p className="tag mt-6 text-graphite text-center">
        Not tickets. The full loop — own it, ship it, watch it, improve it.
      </p>

      {/* Skill orbit — promoted as the central hero moment */}
      <div className="mt-16 w-full max-w-[900px]">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <span
            className="inline-block w-2 h-2 rounded-full bg-[#1F5C58]"
          />
          <span className="font-mono text-[11px] font-bold text-[#1F5C58] uppercase tracking-widest">
            Skills in orbit
          </span>
        </div>
        <SkillOrbit />
      </div>

      {/* Skills list */}
      <div className="mt-14 grid gap-10 lg:grid-cols-3 w-full max-w-[900px] text-left">
        {skills.map((s) => (
          <div key={s.group}>
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-graphite">
              {s.group}
            </h3>
            <ul className="mt-4 space-y-1 text-[17px]">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Chapter>
  );
}
