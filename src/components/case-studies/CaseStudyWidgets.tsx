import { useState } from "react";
import { blinkit } from "../../content";

/* ------------------------------------------------------------- 1. Blinkit Swipe */
type Verdict = "Skipped" | "Saved for later" | "Added";

export function BlinkitSwipeWidget() {
  const [i, setI] = useState(0);
  const [log, setLog] = useState<{ product: string; verdict: Verdict }[]>([]);

  const card = blinkit.cards[i];

  function decide(verdict: Verdict) {
    if (!card) return;
    setLog((l) => [...l, { product: card.product, verdict }]);
    setI((n) => n + 1);
  }

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-2xl p-6 text-left shadow-xs font-body">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[11px] font-bold text-[#D91A5B] uppercase tracking-wider">
          LIVE INTERACTIVE SIMULATION: TINDER-STYLE 3-CARD SWIPE
        </span>
        <span className="text-[12px] font-medium text-[#6E6E73]">
          Card {Math.min(i + 1, 3)} of 3
        </span>
      </div>
      <p className="text-[12px] text-[#86868B] mb-4">
        Tinder UI/UX mental model: Left = Skip, Right = Save for Later (Hinglish triggers), Up = Add to Live Cart while rider is en route.
      </p>

      <div className="border border-[#E5E5EA] bg-[#F5F5F7] p-6 rounded-2xl shadow-xs">
        {card ? (
          <>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-0.5 rounded-full">
              {card.level}
            </span>
            <p className="mt-3 text-[22px] font-bold leading-tight text-[#1D1D1F]">
              {card.product}
            </p>
            <p className="mt-2 text-[15px] text-[#6E6E73] leading-relaxed">
              <strong className="text-[#1D1D1F] font-semibold">Why recommended: </strong>
              {card.bridge}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                className="py-2.5 px-4 text-[13px] font-semibold rounded-full bg-[#FFFFFF] border border-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/20 transition-all flex-1 sm:flex-none text-center cursor-pointer"
                onClick={() => decide("Skipped")}
              >
                ← Swipe Left (Skip)
              </button>
              <button
                type="button"
                className="py-2.5 px-4 text-[13px] font-semibold rounded-full bg-[#FFFFFF] border border-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/20 transition-all flex-1 sm:flex-none text-center cursor-pointer"
                onClick={() => decide("Saved for later")}
              >
                Swipe Right → (Save for later)
              </button>
              <button
                type="button"
                className="py-2.5 px-5 text-[13px] font-semibold rounded-full text-[#FFFFFF] bg-[#0071E3] hover:bg-[#0077ED] transition-all flex-1 sm:flex-none text-center shadow-xs cursor-pointer"
                onClick={() => decide("Added")}
              >
                ↑ Swipe Up (+ Add to Order)
              </button>
            </div>
          </>
        ) : (
          <div className="py-4">
            <p className="text-[16px] text-[#1D1D1F] font-semibold">
              Completed the rail. Exactly three contextual cards displayed, zero bloated filler.
            </p>
            <button
              type="button"
              className="mt-4 text-[13px] font-semibold text-[#FFFFFF] bg-[#1D1D1F] hover:bg-black py-2 px-4 rounded-full transition-all"
              onClick={() => {
                setI(0);
                setLog([]);
              }}
            >
              Reset Simulation
            </button>
          </div>
        )}
      </div>

      {log.length > 0 && (
        <div className="mt-3.5 text-[12px] text-[#6E6E73]">
          <span className="font-semibold text-[#1D1D1F]">Session Log: </span>
          {log.map((l) => `${l.product} (${l.verdict})`).join(" · ")}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- 2. HDFC Ladder */
export function HdfcLadderWidget() {
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    {
      name: "1. PII Scan",
      desc: "Incoming prompt is sanitized for phone numbers, PAN, and investor account IDs before any database call.",
      risk: "Identity leak prevention",
    },
    {
      name: "2. Scope Check",
      desc: "Intent classifier verifies the query relates to the 5 supported schemes. Rejects stock tips or crypto questions.",
      risk: "SEBI boundary compliance",
    },
    {
      name: "3. Vector Retrieve",
      desc: "Qdrant Cloud fetches top-K relevant chunks with dynamic cosine threshold. Filters low-confidence noise.",
      risk: "Relevance precision",
    },
    {
      name: "4. Citation Check",
      desc: "Generated sentences are strictly verified against source SID clauses. Unsubstantiated claims trigger fail-closed.",
      risk: "Zero hallucination guarantee",
    },
    {
      name: "5. Grounded Output",
      desc: "Response delivered with direct document clause citation (e.g. [HDFC Top 100 SID - Sec 4.2]).",
      risk: "Audit-ready answer",
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-2xl p-6 text-left shadow-xs font-body">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[11px] font-bold text-[#0071E3] uppercase tracking-wider">
          FAIL-CLOSED VERIFICATION PIPELINE (INTERACTIVE)
        </span>
        <span className="text-[12px] text-[#6E6E73] hidden sm:inline">
          Click any stage to inspect guardrail
        </span>
      </div>

      {/* Pipeline stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((s, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "bg-[#0071E3]/10 border-[#0071E3] text-[#0071E3] shadow-xs"
                  : "bg-[#F5F5F7] border-[#E5E5EA] text-[#6E6E73] hover:text-[#1D1D1F] hover:border-black/20"
              }`}
            >
              <span className={`block text-[12px] font-bold ${isActive ? "text-[#0071E3]" : "text-[#1D1D1F]"}`}>
                {s.name}
              </span>
              <span className="block text-[10px] text-[#6E6E73] mt-1 truncate">
                {s.risk}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active step inspector */}
      <div className="mt-4 border border-[#E5E5EA] bg-[#F5F5F7] p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
          <h4 className="text-[14px] font-bold text-[#1D1D1F]">
            {steps[activeStep].name}: Guardrail Inspection
          </h4>
        </div>
        <p className="mt-2 text-[14px] text-[#6E6E73] leading-relaxed">
          {steps[activeStep].desc}
        </p>
        <p className="mt-2.5 text-[12px] text-[#0071E3] font-semibold">
          Fail policy: If this check fails, the query stops immediately with a graceful refusal.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- 3. OCR Record Comparison */
export function OcrRecordWidget() {
  const [showFailedGuess, setShowFailedGuess] = useState(false);

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-2xl p-6 text-left shadow-xs font-body">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-[11px] font-bold text-[#1F5C58] uppercase tracking-wider">
          COMPLIANCE RECORD INTEGRITY BENCHMARK
        </span>
        <button
          type="button"
          onClick={() => setShowFailedGuess(!showFailedGuess)}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#1F5C58]/30 hover:border-[#1F5C58] text-[#1F5C58] bg-[#F5F5F7]"
        >
          {showFailedGuess ? "Show: PM Image-Fallback Architecture" : "Simulate: Naive Model Guessing (Tesseract)"}
        </button>
      </div>

      <div className="border border-[#E5E5EA] bg-[#F5F5F7] p-5 rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#E5E5EA] pb-2 mb-3">
          <span className="text-[11px] font-bold text-[#6E6E73]">FIELD IDENTIFIER</span>
          <span className="text-[11px] font-bold text-[#6E6E73]">SYSTEM EXTRACTION RESULT</span>
        </div>

        <div className="space-y-3 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[#6E6E73] font-medium">Applicant Name</span>
            <span className="text-[#1D1D1F] font-semibold">Ramesh Kumar Sharma (98.4% conf)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6E6E73] font-medium">Policy Amount</span>
            <span className="text-[#1D1D1F] font-semibold">₹ 1,50,000 (99.1% conf)</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E5EA]">
            <span className="text-[#6E6E73] font-medium">Signature Field</span>
            {showFailedGuess ? (
              <span className="text-[#D91A5B] font-semibold bg-[#D91A5B]/10 px-2.5 py-0.5 rounded-full border border-[#D91A5B]/20">
                [Transcribed: "R. K. S."] ❌ CORRUPTED AUDIT TRAIL
              </span>
            ) : (
              <span className="text-[#34C759] font-semibold bg-[#34C759]/10 px-2.5 py-0.5 rounded-full border border-[#34C759]/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                [Preserved as Image Crop inside SQL] ✓ AUDIT-PROOF
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3.5 text-[12px] text-[#6E6E73]">
        {showFailedGuess
          ? "⚠️ Notice: Naive OCR invents letters for cursive loops. In an audit, this fails because a machine cannot legally sign on behalf of an applicant."
          : "✓ Production Policy: High-confidence text is automated; signatures are kept as embedded images. 100% legal validity preserved."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- 4. Fraud Gate Simulator */
export function FraudGateWidget() {
  const [prec, setPrec] = useState(0.88);
  const [rec, setRec] = useState(0.82);

  const prodPrec = 0.85;
  const prodRec = 0.80;

  const passesPrecision = prec > prodPrec;
  const passesRecall = rec > prodRec;
  const isPromoted = passesPrecision && passesRecall;

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-2xl p-6 text-left shadow-xs font-body">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[11px] font-bold text-[#D91A5B] uppercase tracking-wider">
          LIVE SHADOW PROMOTION GATE CHECKER
        </span>
        <span className="text-[12px] text-[#6E6E73]">
          Dual-Threshold Gate
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Production baseline */}
        <div className="border border-[#E5E5EA] bg-[#F5F5F7] p-4 rounded-xl">
          <span className="text-[11px] text-[#6E6E73] uppercase font-bold block mb-2">Production Baseline</span>
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#6E6E73]">Precision:</span>
              <span className="font-bold text-[#1D1D1F]">85.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E6E73]">Recall:</span>
              <span className="font-bold text-[#1D1D1F]">80.0%</span>
            </div>
          </div>
        </div>

        {/* Candidate Interactive Sliders */}
        <div className="border border-[#E5E5EA] bg-[#F5F5F7] p-4 rounded-xl">
          <span className="text-[11px] text-[#0071E3] uppercase font-bold block mb-2">Candidate Model (Shadow)</span>
          <div className="space-y-2.5 text-[12px]">
            <div>
              <div className="flex justify-between text-[#1D1D1F] mb-1">
                <span>Precision: <strong>{(prec * 100).toFixed(1)}%</strong></span>
                <span className={passesPrecision ? "text-[#34C759] font-bold" : "text-[#D91A5B] font-bold"}>
                  {passesPrecision ? "> Prod ✓" : "≤ Prod ✗"}
                </span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.95"
                step="0.01"
                value={prec}
                onChange={(e) => setPrec(parseFloat(e.target.value))}
                className="w-full accent-[#0071E3] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[#1D1D1F] mb-1">
                <span>Recall: <strong>{(rec * 100).toFixed(1)}%</strong></span>
                <span className={passesRecall ? "text-[#34C759] font-bold" : "text-[#D91A5B] font-bold"}>
                  {passesRecall ? "> Prod ✓" : "≤ Prod ✗"}
                </span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.95"
                step="0.01"
                value={rec}
                onChange={(e) => setRec(parseFloat(e.target.value))}
                className="w-full accent-[#0071E3] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gate verdict */}
      <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${
        isPromoted
          ? "bg-[#34C759]/10 border-[#34C759]/30 text-[#34C759]"
          : "bg-[#D91A5B]/10 border-[#D91A5B]/30 text-[#D91A5B]"
      }`}>
        <div className="text-[13px]">
          <span className="font-bold uppercase tracking-wider block">
            Gate Verdict: {isPromoted ? "PROMOTE CANDIDATE TO PRODUCTION" : "PROMOTION REJECTED"}
          </span>
          <span className="text-[12px] opacity-90 font-normal">
            {isPromoted
              ? "Candidate strictly outperforms production on BOTH precision and recall."
              : "Rule violation: Pipeline refuses promotion unless BOTH metrics show verified improvement."}
          </span>
        </div>
      </div>
    </div>
  );
}
