import { useState } from "react";
import { Chapter, Draw, Note, P, PullQuote, SectionHeader } from "../ui";
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
import { useScrollProgress, useElementScrollProgress } from "../hooks/useScrollMotion";

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

        {/* Navigation cards — distinctly styled per section */}
        <div className="relative z-20 mt-20 flex flex-col md:flex-row gap-5 items-stretch justify-center w-full max-w-5xl mx-auto px-4 text-left">
          {/* My Story */}
          <Link
            to="/story"
            id="nav-story"
            className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border-2 border-[#A33726]/30 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#A33726]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Icon glyph */}
            <div className="w-10 h-10 rounded-xl bg-[#A33726]/10 border border-[#A33726]/20 flex items-center justify-center mb-4 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3 4h12M3 8h8M3 12h10" stroke="#A33726" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#A33726] uppercase mb-1">My Story</span>
            <h2 className="text-[20px] font-display font-medium text-ink mb-2 leading-snug">The analyst between two rooms</h2>
            <p className="text-graphite font-body text-[14px] leading-relaxed flex-1">Background, turning points, and the three principles I apply before anything gets built.</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-[11px] text-graphite">5 chapters · ~6 min</span>
              <span className="font-mono text-[13px] font-bold text-[#A33726] group-hover:translate-x-1 transition-transform inline-block">Read →</span>
            </div>
          </Link>

          {/* Case Studies */}
          <Link
            to="/work"
            id="nav-work"
            className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border-2 border-[#1B3AC7]/30 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1B3AC7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-xl bg-[#1B3AC7]/10 border border-[#1B3AC7]/20 flex items-center justify-center mb-4 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="2" y="5" width="5" height="10" rx="1" stroke="#1B3AC7" strokeWidth="1.5"/>
                <rect x="9" y="2" width="5" height="13" rx="1" stroke="#1B3AC7" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#1B3AC7] uppercase mb-1">Case Studies</span>
            <h2 className="text-[20px] font-display font-medium text-ink mb-2 leading-snug">Evidence over instinct</h2>
            <p className="text-graphite font-body text-[14px] leading-relaxed flex-1">Blinkit, OCR, HDFC, Fraud detection — each with the hypothesis, the evidence, and what changed because of it.</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-[11px] text-graphite">5 case studies · live demos</span>
              <span className="font-mono text-[13px] font-bold text-[#1B3AC7] group-hover:translate-x-1 transition-transform inline-block">View →</span>
            </div>
          </Link>

          {/* Vision */}
          <Link
            to="/vision"
            id="nav-vision"
            className="flex flex-col w-full md:w-1/3 group relative overflow-hidden bg-paper border-2 border-[#1F5C58]/30 p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F5C58]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-10 h-10 rounded-xl bg-[#1F5C58]/10 border border-[#1F5C58]/20 flex items-center justify-center mb-4 flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="3" stroke="#1F5C58" strokeWidth="1.5"/>
                <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="#1F5C58" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M12.4 5.6l-1.4 1.4M5.6 12.4l-1.4 1.4" stroke="#1F5C58" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#1F5C58] uppercase mb-1">Vision</span>
            <h2 className="text-[20px] font-display font-medium text-ink mb-2 leading-snug">What I want to own next</h2>
            <p className="text-graphite font-body text-[14px] leading-relaxed flex-1">The systems, directions, and skills orbiting the next phase — from card payment flows to owning a product end to end.</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-[11px] text-graphite">Systems + direction</span>
              <span className="font-mono text-[13px] font-bold text-[#1F5C58] group-hover:translate-x-1 transition-transform inline-block">Explore →</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ story scroll motion */

function ParallaxNumeral({ num, accent = "#A33726" }: { num: string; accent?: string }) {
  const { ref, progress } = useElementScrollProgress<HTMLDivElement>();
  // Smooth bidirectional parallax float: moves upwards when scrolling down, downwards when scrolling up
  const floatY = Math.round(progress * -55);
  return (
    <div
      ref={ref}
      className="story-parallax-num"
      style={{
        transform: `translate3d(0, ${floatY}px, 0)`,
        color: accent,
      }}
      aria-hidden="true"
    >
      {num}
    </div>
  );
}

export function StorySpine() {
  const { progress } = useScrollProgress();
  const stops = [
    { id: "between", num: "01", label: "Between" },
    { id: "problem", num: "02", label: "Problem" },
    { id: "rag", num: "03", label: "RAG" },
    { id: "speed", num: "04", label: "Speed" },
    { id: "principles", num: "05", label: "Principles" },
  ];
  return (
    <nav className="story-spine-nav" aria-label="Reading progress spine">
      <div className="story-spine-track">
        <div
          className="story-spine-fill"
          style={{ height: `${Math.min(100, Math.max(6, progress * 100))}%` }}
        />
      </div>
      <div className="story-spine-stops">
        {stops.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="story-spine-stop" title={s.label}>
            <span className="story-spine-dot" />
            <span className="story-spine-label">{s.num} {s.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ story section header */

export function StoryHeader() {
  return (
    <>
      <SectionHeader
        label="My Story"
        meta="5 chapters · background, turning points, principles"
        accent="#A33726"
      />
      <StorySpine />
    </>
  );
}

/* ------------------------------------------------------------------ ch. 02 */

export function Between() {
  const c = ch("between");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} variant="story">
      <ParallaxNumeral num="01" accent="#A33726" />
      <PullQuote accent="#A33726">
        I could hold the conversation, ask the awkward question, and leave the call with a clearer brief than I went in with.
      </PullQuote>
      <p className="tag mb-6 mt-8">{between.lead}</p>
      {between.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <Draw className="mt-14 max-w-[760px] w-full bg-paper border border-rule/80 rounded-2xl p-6 sm:p-10 shadow-sm">
        <svg
          viewBox="0 0 720 220"
          className="w-full"
          role="img"
          aria-label="Technology on one axis, business on the other, with the role sitting where they meet."
        >
          {/* Subtle grid lines in background */}
          <line x1="40" y1="60" x2="680" y2="60" stroke="#12151A" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.08" />
          <line x1="40" y1="110" x2="680" y2="110" stroke="#12151A" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.08" />
          <line x1="180" y1="30" x2="180" y2="170" stroke="#12151A" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.08" />
          <line x1="540" y1="30" x2="540" y2="170" stroke="#12151A" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.08" />

          {/* Main Horizontal Axis: Tech to Business */}
          <line
            x1="40"
            y1="160"
            x2="680"
            y2="160"
            stroke="#12151A"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ ["--len" as string]: 640 }}
          />

          {/* Main Vertical Intersection Axis */}
          <line
            x1="360"
            y1="30"
            x2="360"
            y2="160"
            stroke="#1B3AC7"
            strokeWidth="2"
            strokeDasharray="4 4"
            style={{ ["--len" as string]: 130 }}
          />

          {/* Left Arrow & Label */}
          <polygon points="40,160 52,154 52,166" fill="#12151A" />
          <text
            x="40"
            y="194"
            fill="#12151A"
            fontSize="14"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
          >
            ← {between.axis.left}
          </text>

          {/* Right Arrow & Label */}
          <polygon points="680,160 668,154 668,166" fill="#12151A" />
          <text
            x="680"
            y="194"
            textAnchor="end"
            fill="#12151A"
            fontSize="14"
            fontFamily="IBM Plex Mono, monospace"
            fontWeight="700"
          >
            {between.axis.right} →
          </text>

          {/* Center Meeting Point Radar Rings */}
          <circle cx="360" cy="95" r="32" fill="#1B3AC7" fillOpacity="0.08" stroke="#1B3AC7" strokeWidth="1" strokeOpacity="0.25" />
          <circle cx="360" cy="95" r="18" fill="#1B3AC7" fillOpacity="0.16" stroke="#1B3AC7" strokeWidth="1.5" strokeOpacity="0.45" />
          <circle cx="360" cy="95" r="8" fill="#1B3AC7" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Meeting Marker Callout Badge */}
          <g transform="translate(385, 78)">
            <rect x="0" y="0" width="225" height="34" rx="6" fill="#1B3AC7" fillOpacity="0.08" stroke="#1B3AC7" strokeWidth="1" />
            <text
              x="12"
              y="22"
              fill="#1B3AC7"
              fontSize="13"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight="700"
            >
              ● {between.axis.marker}
            </text>
          </g>
        </svg>
      </Draw>
      <p className="measure mt-4 text-[18px] text-graphite font-medium">{between.axis.note}</p>

      <PathTimeline />
      <PinnedCards />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 03 */

export function RealProblem() {
  const c = ch("problem");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band variant="story">
      <ParallaxNumeral num="02" accent="#1F5C58" />
      <PullQuote accent="#1F5C58">
        Selling them the thing they named would have been the easy sale and the wrong one.
      </PullQuote>
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
    <Chapter id={c.id} number={c.number} title={c.title} variant="story">
      <ParallaxNumeral num="03" accent="#7A5716" />
      <PullQuote accent="#7A5716">
        I had answered a question nobody asked, in a language the client did not speak.
      </PullQuote>
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
    <Chapter id={c.id} number={c.number} title={c.title} band variant="story">
      <ParallaxNumeral num="04" accent="#1B3AC7" />
      <PullQuote accent="#1B3AC7">
        The gap between a hunch and evidence got short enough that I can afford to be wrong in public, early.
      </PullQuote>
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

function PrincipleCard({ p, i }: { p: { rule: string; body: string }; i: number }) {
  const [open, setOpen] = useState(false);
  const colors = ["#A33726", "#1F5C58", "#1B3AC7"];
  const accent = colors[i % colors.length];
  return (
    <button
      type="button"
      className="principle-card"
      style={{ borderTopColor: accent }}
      data-open={open}
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="principle-card-num" style={{ color: accent }}>
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="principle-card-rule">{p.rule}</p>
        </div>
        <svg
          className="principle-card-chevron mt-1 flex-shrink-0"
          style={{ color: accent }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="principle-card-body">{p.body}</p>
    </button>
  );
}

export function Principles() {
  const c = ch("principles");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} variant="story">
      <ParallaxNumeral num="05" accent="#1F5C58" />
      <p className="measure text-[17px] text-graphite mt-2 mb-8">
        Click any rule to see why it exists.
      </p>
      <ol className="grid gap-3 max-w-[760px] w-full lg:grid-cols-3">
        {principles.map((p, i) => (
          <li key={p.rule}>
            <PrincipleCard p={p} i={i} />
          </li>
        ))}
      </ol>

      <div className="mt-10 grid max-w-[760px] gap-8 sm:grid-cols-2 w-full text-left">
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
