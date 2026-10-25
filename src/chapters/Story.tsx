import { useRef, useState } from "react";
import { Chapter, Draw, Note, P, PullQuote, SectionHeader } from "../ui";
import { Lenses, PathTimeline, PinnedCards } from "../visuals";
import {
  between,
  chapters,
  principles,
  problem,
  questions,
  rag,
  speed,
} from "../content";
import { PhysicsButtons } from "../components/PhysicsButtons";
import { useScrollProgress } from "../hooks/useScrollMotion";
import { CASE_STUDIES, type CaseStudyProject } from "../data/caseStudies";
import { CaseStudyCarousel } from "../components/case-studies/CaseStudyCarousel";
import { CaseStudyModal } from "../components/case-studies/CaseStudyModal";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ opening */

function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F5F5F7]">
      {/* Top soft ambient light highlight */}
      <div 
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-gradient-to-b from-white/95 via-white/50 to-transparent blur-2xl pointer-events-none" 
      />

      {/* Subtle Apple ambient color tints for depth */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 w-[540px] h-[540px] bg-[#0071E3]/[0.02] rounded-full blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-[480px] h-[480px] bg-[#FF6B55]/[0.02] rounded-full blur-3xl pointer-events-none" 
      />
    </div>
  );
}


export function Opening() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <section
      id="opening"
      aria-labelledby="opening-title"
      className="relative flex min-h-[100svh] h-[100svh] flex-col justify-center items-center bg-[#F5F5F7] px-4 py-12 sm:py-16 pt-20 sm:pt-24 lg:px-8 text-center overflow-hidden"
    >
      <HeroBackground />


      <PhysicsButtons titleRef={titleRef} />

      <div className="relative z-20 mx-auto w-full max-w-7xl flex flex-col items-center">
        <h1
          id="opening-title"
          ref={titleRef}
          className="flex flex-col items-center gap-1.5 sm:gap-3 md:gap-4 text-[clamp(32px,6.8vw,72px)] font-display font-bold tracking-[-0.035em] leading-[1.15] sm:leading-[1.2] pb-2 sm:pb-3 pt-1 px-2 max-w-5xl"
        >
          <span
            className="block"
            style={{
              backgroundImage: "linear-gradient(135deg, #B45309 0%, #D97706 40%, #EA580C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Designing products at the
          </span>
          <span className="block">
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #881337 0%, #991B1B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "0.5px rgba(81, 4, 0, 0.45)",
              }}
              className="font-extrabold"
            >
              intersection
            </span>
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #C2410C 0%, #DC2626 45%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {" "}of
            </span>
          </span>
          <span
            className="block"
            style={{
              backgroundImage: "linear-gradient(135deg, #C2410C 0%, #DC2626 45%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            business, tech &amp; AI.
          </span>
        </h1>
      </div>

      {/* Scroll indicator cue to seamlessly transition down into Case Studies */}
      <a
        href="#case-studies"
        aria-label="Scroll to Case Studies"
        className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-[#86868B] hover:text-[#1D1D1F] transition-colors group cursor-pointer select-none"
      >
        <span className="text-[10px] sm:text-[11px] font-display font-medium tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity">
          Case Studies
        </span>
        <svg 
          width="15" 
          height="15" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </a>
    </section>
  );
}

/**
 * Dark section directly below the Hero on the landing page.
 * Pure Apple Pro black (#000000) canvas with AI products headline and case study carousel.
 */
export function LandingDarkSection() {
  const [activeProject, setActiveProject] = useState<CaseStudyProject | null>(null);

  const handleOpenDossier = (project: CaseStudyProject) => {
    setActiveProject(project);
  };

  const handleCloseDossier = () => {
    setActiveProject(null);
  };

  return (
    <section
      id="case-studies"
      aria-label="Case Studies and Architecture"
      className="relative flex w-full flex-col justify-center items-center bg-[#000000] text-white px-3 sm:px-6 lg:px-8 py-12 sm:py-16 text-center overflow-hidden border-t border-white/10"
    >
      {/* Top subtle ambient spotlight glow */}
      <div 
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent blur-3xl pointer-events-none" 
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl flex flex-col items-center">
        {/* User-requested headline */}
        <h2 className="text-[clamp(24px,3.2vw,36px)] font-display font-semibold tracking-[-0.03em] text-[#F5F5F7] leading-[1.18] max-w-3xl px-2">
          AI products
        </h2>

        {/* Subtitle description */}
        <p className="mt-2.5 sm:mt-3 text-[#86868B] font-body text-[14px] sm:text-[15px] max-w-xl px-4 leading-relaxed">
          From enterprise-scale retrieval to multi-agent automation: real problems, engineered architectures, and measurable commercial value.
        </p>

        {/* Carousel Container (Replacing dashed placeholder) */}
        <div className="mt-5 sm:mt-6 w-full h-[460px] sm:h-[490px] md:h-[520px] flex flex-col justify-center items-center relative">
          <CaseStudyCarousel
            projects={CASE_STUDIES}
            onOpenDossier={handleOpenDossier}
            theme="dark"
          />
        </div>

      </div>

      {/* Case Study Dossier Modal */}
      {activeProject && (
        <CaseStudyModal
          project={activeProject}
          allProjects={CASE_STUDIES}
          onClose={handleCloseDossier}
          onSelectProject={setActiveProject}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ story scroll motion */

function ParallaxNumeral({ num, accent = "#A33726" }: { num: string; accent?: string }) {
  return (
    <div
      className="story-parallax-num"
      style={{
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
          <polygon points="40,160 52,154 52,166" fill="#1D1D1F" />
          <text
            x="40"
            y="194"
            fill="#1D1D1F"
            fontSize="14"
            fontFamily="var(--font-display)"
            fontWeight="600"
          >
            ← {between.axis.left}
          </text>

          {/* Right Arrow & Label */}
          <polygon points="680,160 668,154 668,166" fill="#1D1D1F" />
          <text
            x="680"
            y="194"
            textAnchor="end"
            fill="#1D1D1F"
            fontSize="14"
            fontFamily="var(--font-display)"
            fontWeight="600"
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
              fontFamily="var(--font-display)"
              fontWeight="600"
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
            <span className="border border-rule bg-paper px-3 py-2 font-display text-[12px] font-medium">
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
