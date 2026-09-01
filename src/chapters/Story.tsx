import { Chapter, Draw, Note, P } from "../ui";
import { Lenses, PathTimeline, PinnedCards } from "../visuals";
import {
  between,
  chapters,
  meta,
  principles,
  problem,
  questions,
  rag,
  speed,
} from "../content";
import { useRef } from "react";
import { PhysicsButtons } from "../components/PhysicsButtons";
import { Link } from "react-router-dom";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ opening */

function HeroBackground() {
  const marqueeContent = [...meta.keywords, ...meta.keywords, ...meta.keywords];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-clay flex flex-col justify-center">
      {/* Subtle Data Grid overlay for the 'analyst' feel */}
      <div 
        className="absolute inset-0 opacity-[0.12] z-0" 
        style={{
          backgroundImage: `linear-gradient(rgba(18, 21, 26, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 21, 26, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Marquee Background */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gap-16 opacity-80 origin-center -rotate-3 scale-[1.15]">
        {/* Track 1 - Yellow */}
        <div className="flex animate-marquee whitespace-nowrap items-center w-max bg-[#FACC15] py-4 shadow-lg border-y border-black/10">
          {marqueeContent.map((word, i) => (
             <div key={`t1-${word}-${i}`} className="flex items-center gap-6 mx-3">
                <span className="text-black text-[17px] font-mono font-bold tracking-tight uppercase">
                  {word}
                </span>
                <span aria-hidden="true" className="text-black/40 text-[16px]">→</span>
             </div>
          ))}
        </div>
        
        {/* Track 2 - Fluorescent Green (Reverse) */}
        <div className="flex animate-marquee-reverse whitespace-nowrap items-center w-max bg-[#39FF14] py-4 shadow-lg border-y border-black/10" style={{ marginLeft: '-30%' }}>
          {marqueeContent.map((word, i) => (
             <div key={`t2-${word}-${i}`} className="flex items-center gap-6 mx-3">
                <span className="text-black text-[17px] font-mono font-bold tracking-tight uppercase">
                  {word}
                </span>
                <span aria-hidden="true" className="text-black/40 text-[16px]">→</span>
             </div>
          ))}
        </div>
        
        {/* Track 3 - Orange */}
        <div className="flex animate-marquee whitespace-nowrap items-center w-max bg-[#F97316] py-4 shadow-lg border-y border-black/10" style={{ marginLeft: '-15%' }}>
          {marqueeContent.map((word, i) => (
             <div key={`t3-${word}-${i}`} className="flex items-center gap-6 mx-3">
                <span className="text-black text-[17px] font-mono font-bold tracking-tight uppercase">
                  {word}
                </span>
                <span aria-hidden="true" className="text-black/40 text-[16px]">→</span>
             </div>
          ))}
        </div>
      </div>
      
      {/* Edge fades to blend nicely */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-clay to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-clay to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-clay to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-clay to-transparent pointer-events-none z-20" />
    </div>
  );
}

export function Opening() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section
      id="opening"
      aria-labelledby="opening-title"
      className="relative flex min-h-[100svh] flex-col justify-center bg-clay px-6 pb-20 pt-28 sm:px-10 lg:px-16 text-center overflow-hidden"
    >
      <HeroBackground />

      <PhysicsButtons titleRef={titleRef} />

      <div className="relative z-20 mx-auto w-full max-w-page flex flex-col items-center">
        <h1
          id="opening-title"
          ref={titleRef}
          className="text-[42px] font-display font-medium tracking-tight text-ink sm:text-[64px] md:text-[84px] leading-[0.98]"
        >
          {meta.name}
        </h1>
        <p className="measure mt-6 text-[20px] sm:text-[23px] text-[#800000] font-bold font-body leading-relaxed max-w-[62ch]">
          {meta.role}
        </p>

        <div className="relative z-20 mt-20 flex flex-col md:flex-row gap-6 items-stretch justify-center w-full max-w-5xl mx-auto px-4 text-left">
          <Link to="/story" className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border border-rule p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A33726]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-[24px] font-display font-medium text-ink mb-2">My Story</h2>
            <p className="text-graphite font-body text-[15px] leading-relaxed">The background, problems, and principles that shaped my approach.</p>
            <div className="mt-auto pt-8 flex items-center text-[#A33726] font-mono font-bold text-[14px] group-hover:translate-x-2 transition-transform">
              Read Chapter <span className="ml-2">→</span>
            </div>
          </Link>

          <Link to="/work" className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border border-rule p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B3AC7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-[24px] font-display font-medium text-ink mb-2">Case Studies</h2>
            <p className="text-graphite font-body text-[15px] leading-relaxed">Deep dives into Blinkit, OCR, HDFC, Fraud detection, and more.</p>
            <div className="mt-auto pt-8 flex items-center text-[#1B3AC7] font-mono font-bold text-[14px] group-hover:translate-x-2 transition-transform">
              View Work <span className="ml-2">→</span>
            </div>
          </Link>

          <Link to="/vision" className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border border-rule p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F5C58]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-[24px] font-display font-medium text-ink mb-2">Vision</h2>
            <p className="text-graphite font-body text-[15px] leading-relaxed">The systems and directions driving the next phase of scale.</p>
            <div className="mt-auto pt-8 flex items-center text-[#1F5C58] font-mono font-bold text-[14px] group-hover:translate-x-2 transition-transform">
              Explore Vision <span className="ml-2">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ ch. 02 */

export function Between() {
  const c = ch("between");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <p className="tag mb-6">{between.lead}</p>
      {between.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <Draw className="mt-12 max-w-[560px]">
        <svg viewBox="0 0 560 160" className="w-full" role="img" aria-label="Technology on one axis, business on the other, with the role sitting where they meet.">
          <line x1="20" y1="130" x2="540" y2="130" stroke="#C7CCC4" strokeWidth="1" style={{ ["--len" as string]: 520 }} />
          <line x1="280" y1="20" x2="280" y2="130" stroke="#C7CCC4" strokeWidth="1" style={{ ["--len" as string]: 110 }} />
          <circle cx="280" cy="75" r="6" fill="#1B3AC7" stroke="#1B3AC7" strokeWidth="1" style={{ ["--len" as string]: 40 }} />
          <text x="20" y="150" className="tag" fill="#5F6873" fontSize="11" fontFamily="IBM Plex Mono, monospace">
            {between.axis.left}
          </text>
          <text x="540" y="150" textAnchor="end" fill="#5F6873" fontSize="11" fontFamily="IBM Plex Mono, monospace">
            {between.axis.right}
          </text>
          <text x="296" y="79" fill="#12151A" fontSize="11" fontFamily="IBM Plex Mono, monospace">
            {between.axis.marker}
          </text>
        </svg>
      </Draw>
      <p className="measure mt-4 text-[17px] text-graphite">{between.axis.note}</p>

      <PathTimeline />
      <PinnedCards />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 03 */

export function RealProblem() {
  const c = ch("problem");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      {problem.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <div className="mt-12 grid max-w-[760px] gap-px border border-rule bg-rule sm:grid-cols-2">
        <div className="bg-paper p-6">
          <p className="tag">{problem.swap.askedLabel}</p>
          <p className="mt-3 text-[19px] leading-snug text-graphite line-through decoration-1">
            {problem.swap.asked}
          </p>
        </div>
        <div className="bg-paper p-6">
          <p className="tag text-signal">{problem.swap.actualLabel}</p>
          <p className="mt-3 text-[19px] leading-snug">{problem.swap.actual}</p>
        </div>
      </div>
      <p className="tag mt-3">{problem.swap.note}</p>

      <Note>{problem.lesson}</Note>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 04 */

export function Rag() {
  const c = ch("rag");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <P>{rag.intro}</P>

      <ol className="mt-10 max-w-[640px] border border-rule bg-paper">
        {rag.transcript.map((line, i) => (
          <li
            key={line.line}
            className={`flex flex-col gap-1 p-5 sm:flex-row sm:gap-6 ${
              i > 0 ? "border-t border-rule" : ""
            }`}
          >
            <span
              className={`tag w-16 shrink-0 pt-1 ${
                line.who === "Me" ? "text-flag" : ""
              }`}
            >
              {line.who}
            </span>
            <span className="text-[18px] leading-snug">{line.line}</span>
          </li>
        ))}
      </ol>

      {rag.after.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
        {rag.order.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="border border-rule bg-paper px-3 py-2 font-mono text-[12px]">
              {step}
            </span>
            {i < rag.order.length - 1 && (
              <span aria-hidden="true" className="block h-px w-4 bg-rule" />
            )}
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 05 */

export function Speed() {
  const c = ch("speed");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      {speed.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <div className="mt-12 grid max-w-[760px] gap-px border border-rule bg-rule sm:grid-cols-2">
        <div className="bg-paper p-6">
          <p className="tag">{speed.compare.beforeLabel}</p>
          <ul className="mt-4 space-y-3">
            {speed.compare.before.map((s) => (
              <li key={s} className="text-graphite">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-paper p-6">
          <p className="tag text-signal">{speed.compare.afterLabel}</p>
          <ul className="mt-4 space-y-3">
            {speed.compare.after.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 06 */

export function Principles() {
  const c = ch("principles");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <ol className="grid gap-px border border-rule bg-rule lg:grid-cols-3">
        {principles.map((p, i) => (
          <li key={p.rule} className="bg-paper p-6">
            <p className="tag text-signal">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-[21px] leading-tight">{p.rule}</h3>
            <p className="mt-3 text-[17px] text-graphite">{p.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 grid max-w-[760px] gap-8 sm:grid-cols-2">
        <div>
          <p className="tag">{questions.featureLabel}</p>
          <ul className="mt-3 space-y-2">
            {questions.feature.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="tag">{questions.autoLabel}</p>
          <ul className="mt-3 space-y-2">
            {questions.auto.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      <Lenses />
    </Chapter>
  );
}
