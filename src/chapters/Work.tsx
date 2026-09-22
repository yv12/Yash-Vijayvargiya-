import { useState, type ReactNode } from "react";
import { Chapter, Draw, LaunchLink, Note, P, SectionHeader } from "../ui";
import { artifacts, blinkit, chapters, fraud, hdfc, ocr } from "../content";
import { useScrollProgress, useElementScrollProgress } from "../hooks/useScrollMotion";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ work scroll motion */

function WorkSectionShift({
  children,
  side = "left",
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  const { ref, progress } = useElementScrollProgress<HTMLDivElement>();
  const factor = side === "left" ? -1 : 1;
  // Kinetic bilateral shift: smooth lateral glide reacting to scroll depth
  const shiftX = Math.round(progress * 24 * factor);

  return (
    <div
      ref={ref}
      className="work-shift-container w-full flex flex-col items-center"
      style={{
        transform: `translate3d(${shiftX}px, 0, 0)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

export function WorkTelemetryHUD() {
  const { progress, scrollY, direction } = useScrollProgress();
  const percent = Math.round(progress * 100);

  return (
    <aside className="work-telemetry-hud" aria-label="Work telemetry feed">
      <div className="work-telemetry-panel">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="work-telemetry-pulse" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#1B3AC7] uppercase">
              SYS.TELEMETRY
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#1B3AC7]">
            {direction === "down" ? "▼ DN" : "▲ UP"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-3 font-mono text-[11px] text-graphite mt-1.5">
          <span>PROGRESS: {percent}%</span>
          <span>{Math.round(scrollY)}px</span>
        </div>
        <div className="work-telemetry-track mt-1.5">
          <div
            className="work-telemetry-fill"
            style={{ width: `${Math.min(100, Math.max(4, percent))}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ work section header */

export function WorkHeader() {
  const cases = [
    { label: "Blinkit", href: "#blinkit" },
    { label: "OCR", href: "#ocr" },
    { label: "All Projects", href: "#build" },
    { label: "HDFC", href: "#hdfc" },
    { label: "Fraud", href: "#fraud" },
  ];
  return (
    <>
      <SectionHeader
        label="Case Studies"
        meta="5 case studies · hypothesis, evidence, live demos"
        accent="#1B3AC7"
      />
      <WorkTelemetryHUD />
      {/* Jump nav */}
      <div className="mx-auto max-w-page px-6 sm:px-10 lg:px-16">
        <nav aria-label="Case study sections" className="work-jump-nav">
          <span className="font-mono text-[10px] text-graphite uppercase tracking-widest self-center mr-2">Jump to:</span>
          {cases.map((c) => (
            <a key={c.href} href={c.href} className="work-jump-pill">
              {c.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ dossier header */

function DossierHeader({
  kind,
  kindColor,
  context,
  href,
  hrefLabel,
  trackingSlug,
}: {
  kind: string;
  kindColor: string;
  context: string;
  href?: string;
  hrefLabel?: string;
  trackingSlug?: string;
}) {
  return (
    <div className="dossier-header">
      <div className="flex flex-wrap items-center gap-3 justify-between w-full">
        <span
          className="dossier-kind-badge"
          style={{ color: kindColor, borderColor: `${kindColor}55` }}
        >
          {kind}
        </span>
        {href && hrefLabel && (
          <LaunchLink href={href} accent={kindColor} size="md" trackingSlug={trackingSlug}>
            {hrefLabel}
          </LaunchLink>
        )}
      </div>
      <p className="font-mono text-[12px] text-graphite mt-1">{context}</p>
    </div>
  );
}

/* --------------------------------------------------------- swipe demo (ch 7) */

type Verdict = "Skipped" | "Saved for later" | "Added";

function SwipeDemo() {
  const [i, setI] = useState(0);
  const [log, setLog] = useState<{ product: string; verdict: Verdict }[]>([]);

  const card = blinkit.cards[i];

  function decide(verdict: Verdict) {
    if (!card) return;
    setLog((l) => [...l, { product: card.product, verdict }]);
    setI((n) => n + 1);
  }

  return (
    <div className="mt-10 max-w-[720px] w-full">
      <p className="tag">{blinkit.demoLabel}</p>

      <div className="mt-4 border border-rule bg-paper p-6">
        {card ? (
          <>
            <p className="tag text-signal">{card.level}</p>
            <p className="mt-4 text-[24px] leading-tight font-display">
              {card.product}
            </p>
            <p className="measure mt-3 text-[17px] text-graphite">{card.bridge}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn" onClick={() => decide("Skipped")}>
                Skip
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => decide("Saved for later")}
              >
                Later
              </button>
              <button type="button" className="btn" onClick={() => decide("Added")}>
                Want it now
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[19px]">
              That is the whole rail. Three honest reasons, and nothing padded out to
              fill a fourth slot.
            </p>
            <button
              type="button"
              className="btn mt-6"
              onClick={() => {
                setI(0);
                setLog([]);
              }}
            >
              Run it again
            </button>
          </>
        )}
      </div>

      <p className="tag mt-3" aria-live="polite">
        {log.length === 0
          ? blinkit.demoNote
          : log.map((l) => `${l.product}: ${l.verdict}`).join(" / ")}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ ch. 07 */

export function Blinkit() {
  const c = ch("blinkit");
  const max = Math.max(...blinkit.split.map((s) => s.value));

  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      <WorkSectionShift side="left">
        <DossierHeader
          kind="Fellowship project"
          kindColor="#1B3AC7"
          context={blinkit.context}
          href={blinkit.links[1]?.href}
          hrefLabel="Open swipe MVP"
          trackingSlug="blinkit-swipe"
        />

        <P>
          <strong className="font-semibold">The goal.</strong> {blinkit.goal}
        </P>
        <P>{blinkit.hypothesis}</P>
        <P>{blinkit.method}</P>

        <div className="mt-12 grid max-w-[760px] gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {blinkit.pipeline.map((step) => (
            <div key={step.label} className="bg-paper p-5">
              <p className="font-display text-[26px] leading-none">{step.value}</p>
              <p className="tag mt-2">{step.label}</p>
            </div>
          ))}
        </div>

        <Draw className="mt-12 max-w-[760px] w-full p-6 sm:p-8 bg-paper border border-rule rounded-xl shadow-sm">
          <svg
            viewBox="0 0 700 210"
            className="w-full"
            role="img"
            aria-label={`What the reviews split into: ${blinkit.split
              .map((s) => `${s.label}, ${s.value.toLocaleString()}`)
              .join("; ")}.`}
          >
            {blinkit.split.map((s, idx) => {
              const y = 30 + idx * 48;
              const w = Math.max(12, (s.value / max) * 440);
              const last = idx === blinkit.split.length - 1;
              return (
                <g key={s.label}>
                  {/* Track background */}
                  <line
                    x1="0"
                    y1={y}
                    x2="440"
                    y2={y}
                    stroke="#12151A"
                    strokeWidth="12"
                    strokeOpacity="0.06"
                    strokeLinecap="round"
                  />
                  {/* Filled bar with animated length */}
                  <line
                    x1="0"
                    y1={y}
                    x2={w}
                    y2={y}
                    stroke={last ? "#1B3AC7" : "#454D59"}
                    strokeWidth="12"
                    strokeOpacity={last ? 1 : 0.65}
                    strokeLinecap="round"
                    style={{ ["--len" as string]: w }}
                  />
                  <text
                    x="0"
                    y={y - 12}
                    fill="#12151A"
                    fontSize="14"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                  >
                    {s.label}
                  </text>
                  <text
                    x={w + 14}
                    y={y + 5}
                    fill={last ? "#1B3AC7" : "#12151A"}
                    fontSize="15"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                  >
                    {s.value.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </Draw>

        <P>{blinkit.insight}</P>
        <P>{blinkit.interviews}</P>

        <div className="mt-10 max-w-[760px] border border-rule bg-paper">
          <div className="p-6">
            <p className="tag">{blinkit.reframe.fromLabel}</p>
            <p className="mt-2 text-[19px] text-graphite line-through decoration-1">
              {blinkit.reframe.from}
            </p>
          </div>
          <div className="border-t border-rule p-6">
            <p className="tag text-signal">{blinkit.reframe.toLabel}</p>
            <p className="mt-2 text-[19px]">{blinkit.reframe.to}</p>
          </div>
        </div>

        {blinkit.solution.map((t) => (
          <P key={t.slice(0, 20)}>{t}</P>
        ))}

        <SwipeDemo />

        <Note>{blinkit.honesty}</Note>

        {/* Prominent link block */}
        <div className="mt-10 max-w-[760px] w-full border border-[#1B3AC7]/20 rounded-xl bg-[#1B3AC7]/04 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="text-left">
            <p className="font-mono text-[11px] font-bold text-[#1B3AC7] uppercase tracking-wider">Live Demos</p>
            <p className="text-[15px] text-graphite mt-1">Both deployed. Try the recommendation logic yourself.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {blinkit.links.map((l) => (
              <LaunchLink
                key={l.href}
                href={l.href}
                accent="#1B3AC7"
                size="md"
                trackingSlug={l.label.includes("Swipe") ? "blinkit-swipe" : "blinkit-discovery"}
              >
                {l.label}
              </LaunchLink>
            ))}
          </div>
        </div>
      </WorkSectionShift>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 08 */

export function Ocr() {
  const c = ch("ocr");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <WorkSectionShift side="right">
        <DossierHeader
          kind="Professional (client work)"
          kindColor="#1F5C58"
          context={ocr.context}
        />

        {ocr.body.map((t) => (
          <P key={t.slice(0, 20)}>{t}</P>
        ))}

        <div className="mt-12 max-w-[560px] border border-rule bg-paper p-6 w-full text-left">
          <p className="tag">One record, after processing</p>
          <dl className="mt-5 space-y-4">
            <div className="flex gap-6">
              <dt className="tag w-28 shrink-0 pt-1">Name</dt>
              <dd className="font-mono text-[14px]">Read as text</dd>
            </div>
            <div className="flex gap-6">
              <dt className="tag w-28 shrink-0 pt-1">Amount</dt>
              <dd className="font-mono text-[14px]">Read as text</dd>
            </div>
            <div className="flex gap-6">
              <dt className="tag w-28 shrink-0 pt-1">Signature</dt>
              <dd>
                <span className="inline-block border border-dashed border-signal/60 bg-signal/[0.05] px-3 py-2 font-mono text-[12px] text-signal">
                  kept as an image, not guessed
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <P>{ocr.decision}</P>
        <P>{ocr.choice}</P>
        <P>
          <strong className="font-semibold">Result.</strong> {ocr.outcome}
        </P>
        <Note>{ocr.lesson}</Note>
      </WorkSectionShift>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 09 */

export function Build() {
  const c = ch("build");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      <WorkSectionShift side="left">
        <DossierHeader
          kind="All projects"
          kindColor="#7A5716"
          context="Client work stays anonymised. Fellowship and personal projects are labelled — so you can tell what was shipped for a paying client and what I built to learn something."
        />

        <ul className="mt-4 grid gap-px border border-rule bg-rule md:grid-cols-2 w-full max-w-[900px]">
          {artifacts.map((a) => (
            <li key={a.name} className="flex flex-col bg-paper p-6 text-left">
              <div className="flex items-start justify-between gap-2">
                <p
                  className="dossier-kind-badge self-start"
                  style={{
                    color: a.kind === "Professional" ? "#1F5C58" : a.kind === "Fellowship" ? "#1B3AC7" : "#7A5716",
                    borderColor: a.kind === "Professional" ? "#1F5C5855" : a.kind === "Fellowship" ? "#1B3AC755" : "#7A571655",
                  }}
                >
                  {a.kind}
                </p>
                {a.href && (
                  <LaunchLink
                    href={a.href}
                    accent={a.kind === "Professional" ? "#1F5C58" : a.kind === "Fellowship" ? "#1B3AC7" : "#7A5716"}
                    size="sm"
                    trackingSlug={a.slug}
                  >
                    Open
                  </LaunchLink>
                )}
              </div>
              <h3 className="mt-3 text-[19px] leading-tight font-display">{a.name}</h3>
              <p className="mt-2 text-[15px] text-graphite flex-1">{a.line}</p>
              <p className="tag mt-4 text-[11px]">{a.stack}</p>
            </li>
          ))}
        </ul>
      </WorkSectionShift>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 10 */

export function Hdfc() {
  const c = ch("hdfc");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <WorkSectionShift side="right">
        <DossierHeader
          kind="Fellowship project"
          kindColor="#1B3AC7"
          context={hdfc.context}
          href={hdfc.href}
          hrefLabel="Open the assistant"
          trackingSlug="hdfc"
        />

        {hdfc.body.map((t) => (
          <P key={t.slice(0, 20)}>{t}</P>
        ))}

        <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
          {["Question", "PII scan", "Scope check", "Retrieve", "Citation check", "Answer"].map(
            (step, i, arr) => (
              <li key={step} className="flex items-center gap-3">
                <span className="border border-rule bg-paper px-3 py-2 font-mono text-[12px]">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span aria-hidden="true" className="block h-px w-4 bg-rule" />
                )}
              </li>
            )
          )}
        </ol>
        <p className="tag mt-3">Any step can stop the answer. None of them can invent one.</p>

        <P>{hdfc.infra}</P>

        {/* Prominent CTA */}
        <div className="mt-10 max-w-[560px] w-full border border-[#1B3AC7]/20 rounded-xl bg-[#1B3AC7]/[0.04] p-6 flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-mono text-[11px] font-bold text-[#1B3AC7] uppercase tracking-wider">Live Tool</p>
            <p className="text-[15px] text-graphite mt-1">Ask it about an HDFC mutual fund scheme.</p>
          </div>
          <LaunchLink href={hdfc.href} accent="#1B3AC7" size="lg" trackingSlug="hdfc">
            Open assistant
          </LaunchLink>
        </div>
      </WorkSectionShift>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 11 */

export function Fraud() {
  const c = ch("fraud");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      <WorkSectionShift side="left">
        <DossierHeader
          kind="Personal project"
          kindColor="#A33726"
          context={fraud.context}
          href={fraud.href}
          hrefLabel="Open the pipeline"
          trackingSlug="fraud"
        />

        {fraud.body.map((t) => (
          <P key={t.slice(0, 20)}>{t}</P>
        ))}

        <div className="mt-12 max-w-[620px] border border-rule bg-paper w-full">
          <div className="p-6">
            <p className="tag">{fraud.gate.label}</p>
            <ul className="mt-4 space-y-3">
              {fraud.gate.conditions.map((cond) => (
                <li key={cond} className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="tag text-signal">
                    and
                  </span>
                  <span className="font-mono text-[14px]">{cond}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-rule p-6">
            <p className="tag">{fraud.gate.verdictLabel}</p>
            <p className="mt-2 font-display text-[28px] leading-none text-flag">
              {fraud.gate.verdict}
            </p>
            <p className="measure mt-3 text-[17px] text-graphite">
              {fraud.gate.verdictNote}
            </p>
          </div>
        </div>

        {/* Prominent CTA */}
        <div className="mt-10 max-w-[560px] w-full border border-[#A33726]/20 rounded-xl bg-[#A33726]/[0.04] p-6 flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-mono text-[11px] font-bold text-[#A33726] uppercase tracking-wider">Live Pipeline</p>
            <p className="text-[15px] text-graphite mt-1">The full model lifecycle — staging, promotion gate, drift monitor.</p>
          </div>
          <LaunchLink href={fraud.href} accent="#A33726" size="lg" trackingSlug="fraud">
            Open pipeline
          </LaunchLink>
        </div>
      </WorkSectionShift>
    </Chapter>
  );
}
