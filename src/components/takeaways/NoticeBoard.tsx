import { useState } from "react";
import { Link } from "react-router-dom";

interface PinnedNote {
  id: string;
  caseStudyId: string;
  project: string;
  domain: string;
  pinColor: string;
  rotationClass: string;
  learning: string;
  personalTakeaway: string;
}

const PINNED_NOTES: PinnedNote[] = [
  {
    id: "hdfc",
    caseStudyId: "hdfc-rag",
    project: "HDFC Assistant",
    domain: "GenAI & RAG • Fintech",
    pinColor: "#DC2626", // Red pin
    rotationClass: "rotate-[-0.8deg]",
    learning:
      "In financial products, guessing is a legal liability. Users trust a system much more when it openly admits limits instead of sounding confident while wrong.",
    personalTakeaway:
      "This project taught me that user trust isn't won by a bot that can talk about everything, but by one that knows when to stop. In my future GenAI systems, I will always prioritize strict fail-closed boundaries over conversational looseness: refusing gracefully when confidence is low protects the business and earns genuine user trust.",
  },
  {
    id: "blinkit",
    caseStudyId: "blinkit-discovery",
    project: "Blinkit",
    domain: "Growth & UI/UX • Quick-Commerce",
    pinColor: "#D97706", // Amber pin
    rotationClass: "rotate-[0.6deg]",
    learning:
      "When staple buying slowed, teams rushed to discount. Data showed price was not the problem. People in a hurry avoid browsing endless catalogs.",
    personalTakeaway:
      "I saw firsthand how easy it is to blame pricing when discovery is the actual bottleneck. Going forward with recommendation engines, I focus on cognitive context over catalog size: showing three explainable items directly tied to what the user already has in their cart consistently beats bombarding them with generic carousels.",
  },
  {
    id: "ocr",
    caseStudyId: "handwritten-ocr",
    project: "Paperform Digitisation",
    domain: "OCR • Healthcare",
    pinColor: "#0D9488", // Teal pin
    rotationClass: "rotate-[-0.5deg]",
    learning:
      "Trying to automate everything creates silent disasters. Forcing OCR models to transcribe cursive signatures destroys legal proof and audit trails.",
    personalTakeaway:
      "I used to aim for 100% end-to-end automation, but this project cured me of that. When handling legal and healthcare records, forcing an OCR model to guess a signature creates catastrophic silent errors. My takeaway for future vision workflows: automate the obvious text, and preserve raw image crops for high-risk fields to keep an airtight human-in-the-loop audit trail.",
  },
  {
    id: "fraud",
    caseStudyId: "fraud-ops",
    project: "Commercial Lending Software Solution",
    domain: "Workflow Automation & RAG",
    pinColor: "#E11D48", // Rose pin
    rotationClass: "rotate-[0.7deg]",
    learning:
      "Manually sifting hundreds of lenders for complex deals creates massive friction. Intelligent deal matching and automated underwriting pipelines turn weeks of back-and-forth into hours.",
    personalTakeaway:
      "In commercial lending, broker success isn't just CRM tracking—it's analyzing 200+ lender appetite data points and automating qualification upfront. Shifting from manual spreadsheets to an AI-driven matching and workflow engine cut deal turnaround by 65% and radically improved loan conversions.",
  },
  {
    id: "call",
    caseStudyId: "call-audit",
    project: "Call Quality Audit",
    domain: "GenAI & Event-Driven Automation • Sales Ops",
    pinColor: "#2563EB", // Blue pin
    rotationClass: "rotate-[-0.7deg]",
    learning:
      "Giving sales reps an arbitrary score out of one hundred creates resentment. Giving them the exact spoken sentence where they lost the customer creates instant agreement.",
    personalTakeaway:
      "Watching reps push back against black-box scores showed me that AI feedback must be grounded in undeniable evidence. In my future speech and conversational AI products, I will never surface subjective aggregate scores without pinning the exact verbatim quote and timestamp so users immediately agree with the feedback.",
  },
  {
    id: "insurance",
    caseStudyId: "insurance-rag",
    project: "Insurance Bot",
    domain: "RAG • Insurance Tech",
    pinColor: "#7C3AED", // Purple pin
    rotationClass: "rotate-[0.5deg]",
    learning:
      "Mixing customer policy rules across multiple insurance providers causes costly mistakes. An answer that applies to one company can void coverage with another.",
    personalTakeaway:
      "This project showed me the danger of naive vector search in enterprise knowledge bases. When dealing with complex policies, cross-contamination is fatal. My rule for future enterprise RAG architectures is to build hard metadata fences and tenant isolation at the database layer before retrieval even begins.",
  },
  {
    id: "hr",
    caseStudyId: "hr-automation",
    project: "HR Onboarding",
    domain: "Event-Driven Automation(n8n) • HR Ops",
    pinColor: "#EA580C", // Orange pin
    rotationClass: "rotate-[-0.6deg]",
    learning:
      "The reason onboarding takes four days is never the tools. It is the waiting between busy people in different departments for manual email approvals.",
    personalTakeaway:
      "I learned that the highest-impact automation often targets idle human waiting time rather than trying to replace human judgment. By connecting the signed contract webhook directly into provisioning APIs, we cut days down to minutes. In future operational workflows, I look for asynchronous handoffs first.",
  },
];

export function NoticeBoard() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalNotes = PINNED_NOTES.length + 1; // 7 projects + 1 philosophy
  const expandedCount = Object.values(expandedIds).filter(Boolean).length;
  const allExpanded = expandedCount === totalNotes;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedIds({});
    } else {
      const all: Record<string, boolean> = { philosophy: true };
      PINNED_NOTES.forEach((n) => {
        all[n.id] = true;
      });
      setExpandedIds(all);
    }
  };

  return (
    <div className="w-full">
      {/* ── Quick Controls Bar ── */}
      <div className="flex items-center justify-end mb-4 px-1">
        <button
          type="button"
          onClick={toggleAll}
          className="text-[12px] font-semibold text-[#0071E3] hover:text-[#005bb5] transition-colors cursor-pointer py-1 px-2.5 rounded-md hover:bg-[#0071E3]/[0.08]"
        >
          {allExpanded ? "Collapse All Takeaways ↑" : "Expand All Takeaways ↓"}
        </button>
      </div>

      {/* ── Pinned Notes Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {PINNED_NOTES.map((note) => {
          const isExpanded = !!expandedIds[note.id];

          return (
            <article
              key={note.id}
              className={`relative bg-[#FFFFFF] rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-[0_6px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.1)] border border-[#E5E7EB] transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between text-left ${note.rotationClass}`}
            >
              {/* Push Pin */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-5.5 h-5.5 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.35)] border border-white/60 flex items-center justify-center pointer-events-none z-10"
                style={{ backgroundColor: note.pinColor }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>

              <div>
                {/* Project Title & Domain Badge */}
                <div className="flex items-start justify-between gap-2 mb-2 pt-1.5">
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-[#111827] tracking-tight leading-snug">
                    {note.project}
                  </h4>
                  <span className="text-[10px] font-mono font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded text-right whitespace-nowrap flex-shrink-0">
                    {note.domain.split(" • ")[0]}
                  </span>
                </div>

                {/* The Hard Learning */}
                <p className="text-[13px] text-[#4B5563] leading-relaxed mb-3">
                  {note.learning}
                </p>

                {/* Collapsible AI PM Personal Reflection Box */}
                {isExpanded && (
                  <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E5EA] mb-3 transition-all duration-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071E3] block mb-1">
                      What I Learned for Future AI Products
                    </span>
                    <p className="text-[12px] text-[#1F2937] leading-relaxed font-normal">
                      {note.personalTakeaway}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Bar & Footer Link */}
              <div className="pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpanded(note.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0071E3] hover:text-[#005bb5] transition-colors cursor-pointer py-0.5 select-none"
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? "Hide Takeaway" : "PM Takeaway"}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <Link
                  to={`/work#${note.caseStudyId}`}
                  className="text-[11px] font-medium text-[#6B7280] hover:text-[#111827] transition-colors flex-shrink-0"
                >
                  <span>Read Case Study →</span>
                </Link>
              </div>
            </article>
          );
        })}

        {/* 8th Balanced Pin: Personal Philosophy */}
        {(() => {
          const isPhilExpanded = !!expandedIds["philosophy"];

          return (
            <article className="relative bg-[#1F2937] text-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.14)] border border-[#374151] transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between text-left rotate-[0.4deg]">
              {/* Push Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5.5 h-5.5 rounded-full bg-[#10B981] shadow-[0_3px_8px_rgba(0,0,0,0.5)] border border-white/60 flex items-center justify-center pointer-events-none z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-2 pt-1.5">
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-white tracking-tight leading-snug">
                    How I Think About Shipping AI
                  </h4>
                  <span className="text-[10px] font-mono font-medium text-[#9CA3AF] bg-[#374151] px-2 py-0.5 rounded text-right whitespace-nowrap flex-shrink-0">
                    Philosophy
                  </span>
                </div>

                <p className="text-[13px] text-[#D1D5DB] leading-relaxed mb-3">
                  AI products do not fail because algorithms are weak. They fail because human habits, edge cases, and compliance boundaries were ignored during system design.
                </p>

                {isPhilExpanded && (
                  <div className="p-3 rounded-lg bg-[#111827] border border-[#374151] mb-3 transition-all duration-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] block mb-1">
                      My Guiding Stance
                    </span>
                    <p className="text-[12px] text-[#E5E7EB] leading-relaxed font-normal">
                      In every AI product I lead, I evaluate continuously in shadow mode, design fail-closed boundaries that never guess dangerously, and prioritize removing real friction over chasing algorithmic hype.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#374151] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpanded("philosophy")}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981] hover:text-[#34D399] transition-colors cursor-pointer py-0.5 select-none"
                  aria-expanded={isPhilExpanded}
                >
                  <span>{isPhilExpanded ? "Hide Stance" : "PM Stance"}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isPhilExpanded ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <span className="text-[11px] text-[#9CA3AF]">
                  2026 Stance
                </span>
              </div>
            </article>
          );
        })()}
      </div>
    </div>
  );
}
