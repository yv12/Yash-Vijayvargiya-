import { useState } from "react";
import { Chapter, Draw, Note, P } from "../ui";
import { artifacts, blinkit, chapters, fraud, hdfc, ocr } from "../content";

const ch = (id: string) => chapters.find((c) => c.id === id)!;

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
    <div className="mt-10 max-w-[720px]">
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
      <p className="tag mb-6">{blinkit.context}</p>
      <P>
        <strong className="font-semibold">The goal.</strong> {blinkit.goal}
      </P>
      <P>{blinkit.hypothesis}</P>
      <P>{blinkit.method}</P>

      <div className="mt-12 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {blinkit.pipeline.map((step) => (
          <div key={step.label} className="bg-paper p-5">
            <p className="font-display text-[26px] leading-none">{step.value}</p>
            <p className="tag mt-2">{step.label}</p>
          </div>
        ))}
      </div>

      <Draw className="mt-10 max-w-[640px]">
        <svg
          viewBox="0 0 640 190"
          className="w-full"
          role="img"
          aria-label={`What the reviews split into: ${blinkit.split
            .map((s) => `${s.label}, ${s.value.toLocaleString()}`)
            .join("; ")}.`}
        >
          {blinkit.split.map((s, idx) => {
            const y = 22 + idx * 44;
            const w = Math.max(2, (s.value / max) * 380);
            const last = idx === blinkit.split.length - 1;
            return (
              <g key={s.label}>
                <line
                  x1="0"
                  y1={y}
                  x2={w}
                  y2={y}
                  stroke={last ? "#1B3AC7" : "#5F6873"}
                  strokeWidth={last ? 6 : 6}
                  strokeOpacity={last ? 1 : 0.35}
                  style={{ ["--len" as string]: w }}
                />
                <text x="0" y={y - 12} fill="#12151A" fontSize="12" fontFamily="IBM Plex Mono, monospace">
                  {s.label}
                </text>
                <text
                  x={w + 10}
                  y={y + 4}
                  fill="#5F6873"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
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

      <div className="mt-8 flex flex-wrap gap-3">
        {blinkit.links.map((l) => (
          <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 08 */

export function Ocr() {
  const c = ch("ocr");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <p className="tag mb-6">{ocr.context}</p>
      {ocr.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <div className="mt-12 max-w-[560px] border border-rule bg-paper p-6">
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
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 09 */

export function Build() {
  const c = ch("build");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      <P>
        Client work is labelled as such and stays anonymised. Fellowship and personal
        projects are labelled too, so you can tell what was shipped for a paying
        client and what I built to learn something.
      </P>

      <ul className="mt-10 grid gap-px border border-rule bg-rule md:grid-cols-2">
        {artifacts.map((a) => (
          <li key={a.name} className="flex flex-col bg-paper p-6">
            <p className="tag text-signal">{a.kind}</p>
            <h3 className="mt-3 text-[21px] leading-tight">{a.name}</h3>
            <p className="mt-2 text-[17px] text-graphite">{a.line}</p>
            <p className="tag mt-4">{a.stack}</p>
            {a.href && (
              <a
                className="link mt-4 font-mono text-[12px]"
                href={a.href}
                target="_blank"
                rel="noreferrer"
              >
                Open it
              </a>
            )}
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 10 */

export function Hdfc() {
  const c = ch("hdfc");
  return (
    <Chapter id={c.id} number={c.number} title={c.title}>
      <p className="tag mb-6">{hdfc.context}</p>
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

      <a className="btn mt-8 inline-block" href={hdfc.href} target="_blank" rel="noreferrer">
        Open the assistant
      </a>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ ch. 11 */

export function Fraud() {
  const c = ch("fraud");
  return (
    <Chapter id={c.id} number={c.number} title={c.title} band>
      <p className="tag mb-6">{fraud.context}</p>
      {fraud.body.map((t) => (
        <P key={t.slice(0, 20)}>{t}</P>
      ))}

      <div className="mt-12 max-w-[620px] border border-rule bg-paper">
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

      <a className="btn mt-8 inline-block" href={fraud.href} target="_blank" rel="noreferrer">
        Open the pipeline
      </a>
    </Chapter>
  );
}
