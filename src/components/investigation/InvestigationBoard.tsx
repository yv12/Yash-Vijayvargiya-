import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export interface PrincipleNode {
  id: string;
  caseStudyId: string;
  title: string;
  domain: string;
  category: "guardrails" | "proof" | "flow";
  summary: string;
  sharedLesson: string;
  connectedTo: {
    targetId: string;
    relationship: string;
  }[];
  // Coordinates in percentage on desktop canvas
  x: number;
  y: number;
}

const PRINCIPLES: PrincipleNode[] = [
  {
    id: "hdfc-rag",
    caseStudyId: "hdfc-rag",
    title: "HDFC Mutual Fund Assistant",
    domain: "Fintech & Advisory",
    category: "guardrails",
    summary:
      "In financial products, guessing is a legal liability. Systems build lasting trust when they openly state their limits instead of sounding confident while wrong.",
    sharedLesson: "Strict fail-closed boundaries: Never let conversational looseness override compliance rules.",
    connectedTo: [
      {
        targetId: "handwritten-ocr",
        relationship: "Both choose to refuse guessing when confidence drops to protect legal audit trails.",
      },
      {
        targetId: "insurance-rag",
        relationship: "Both enforce strict data scoping so answers never cross provider boundaries.",
      },
    ],
    x: 20,
    y: 22,
  },
  {
    id: "handwritten-ocr",
    caseStudyId: "handwritten-ocr",
    title: "Compliance Records Digitization",
    domain: "Legal Operations",
    category: "guardrails",
    summary:
      "Trying to automate everything creates silent disasters. Saving a clean cropped photo of a cursive signature preserves legal proof while automating standard text.",
    sharedLesson: "Hybrid human-in-the-loop: Automate the clear fields, keep original image snippets for signatures.",
    connectedTo: [
      {
        targetId: "hdfc-rag",
        relationship: "Both protect user trust by refusing to invent answers when certainty is low.",
      },
      {
        targetId: "fraud-ops",
        relationship: "Both apply strict threshold filters to stop errors from silently entering production.",
      },
    ],
    x: 50,
    y: 16,
  },
  {
    id: "insurance-rag",
    caseStudyId: "insurance-rag",
    title: "Multi-Carrier Insurance Assistant",
    domain: "Customer Support",
    category: "guardrails",
    summary:
      "Mixing policy rules across different carriers causes costly mistakes. Absolute separation between provider data protects support teams from giving wrong answers.",
    sharedLesson: "Multi-tenant scoping: An answer that applies to Carrier A could void coverage with Carrier B.",
    connectedTo: [
      {
        targetId: "hdfc-rag",
        relationship: "Both enforce strict tenant fences so rules never cross-contaminate.",
      },
      {
        targetId: "call-audit",
        relationship: "Both anchor every recommendation to specific verified source clauses.",
      },
    ],
    x: 80,
    y: 22,
  },
  {
    id: "hr-automation",
    caseStudyId: "hr-automation",
    title: "Enterprise Onboarding Workflow",
    domain: "Internal Operations",
    category: "flow",
    summary:
      "Multi-day onboarding delays are caused by waiting for human email handoffs, not slow tools. Connecting contract signing directly to system accounts removes the delay.",
    sharedLesson: "Eliminate idle wait states: Replace asynchronous email chains with automated API triggers.",
    connectedTo: [
      {
        targetId: "blinkit-discovery",
        relationship: "Both remove friction at high-intent transitions to keep momentum moving.",
      },
      {
        targetId: "handwritten-ocr",
        relationship: "Both automate routine data entry so teams can focus on human decisions.",
      },
    ],
    x: 30,
    y: 54,
  },
  {
    id: "blinkit-discovery",
    caseStudyId: "blinkit-discovery",
    title: "Basket Discovery Engine",
    domain: "Quick Commerce",
    category: "flow",
    summary:
      "When customers buy basic staples, discounts do not drive discovery. Basket size grows when you show why a specific item fits what is already in their cart.",
    sharedLesson: "Contextual relevance over endless browsing: Meet users where their intent already exists.",
    connectedTo: [
      {
        targetId: "hr-automation",
        relationship: "Both solve bottlenecks by removing cognitive effort and waiting.",
      },
      {
        targetId: "call-audit",
        relationship: "Both analyze real user behavior rather than relying on generic guesses.",
      },
    ],
    x: 70,
    y: 54,
  },
  {
    id: "fraud-ops",
    caseStudyId: "fraud-ops",
    title: "Commercial Lending Software Solution",
    domain: "Commercial Finance",
    category: "proof",
    summary:
      "Manually sifting hundreds of lenders wastes days. An AI matching engine analyzing 200+ data points pre-qualifies deals directly to underwriting.",
    sharedLesson: "Automated qualification: Intelligent criteria matching accelerates turnaround by 65%.",
    connectedTo: [
      {
        targetId: "handwritten-ocr",
        relationship: "Both enforce automated promotion gates to prevent silent data regressions.",
      },
      {
        targetId: "call-audit",
        relationship: "Both prioritize auditable real-world ground truth over aggregate vanity scores.",
      },
    ],
    x: 35,
    y: 84,
  },
  {
    id: "call-audit",
    caseStudyId: "call-audit",
    title: "Call Quality & Coaching Audit",
    domain: "Sales Operations",
    category: "proof",
    summary:
      "Giving sales reps an arbitrary score out of one hundred causes resentment. Pinpointing the exact spoken sentence where they lost the customer creates instant agreement.",
    sharedLesson: "Verifiable evidence over subjective scores: Constructive coaching requires clear proof.",
    connectedTo: [
      {
        targetId: "fraud-ops",
        relationship: "Both eliminate subjective ratings in favor of concrete evidence.",
      },
      {
        targetId: "insurance-rag",
        relationship: "Both point directly to verbatim timestamps and cited text.",
      },
    ],
    x: 65,
    y: 84,
  },
];

type CategoryFilter = "all" | "guardrails" | "proof" | "flow";

export function InvestigationBoard() {
  const [selectedId, setSelectedId] = useState<string>("hdfc-rag");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const activeNode = useMemo(() => {
    return PRINCIPLES.find((p) => p.id === (hoveredId || selectedId)) || PRINCIPLES[0];
  }, [hoveredId, selectedId]);

  // Set of connected project IDs for the currently active node
  const connectedIds = useMemo(() => {
    const ids = new Set<string>();
    ids.add(activeNode.id);
    activeNode.connectedTo.forEach((c) => ids.add(c.targetId));
    PRINCIPLES.forEach((p) => {
      if (p.connectedTo.some((c) => c.targetId === activeNode.id)) {
        ids.add(p.id);
      }
    });
    return ids;
  }, [activeNode]);

  // Filtered list of links to draw
  const allLinks = useMemo(() => {
    const links: {
      from: PrincipleNode;
      to: PrincipleNode;
      relationship: string;
      category: string;
    }[] = [];

    PRINCIPLES.forEach((p) => {
      p.connectedTo.forEach((conn) => {
        const target = PRINCIPLES.find((t) => t.id === conn.targetId);
        if (target && p.id < target.id) {
          links.push({
            from: p,
            to: target,
            relationship: conn.relationship,
            category: p.category,
          });
        }
      });
    });

    return links;
  }, []);

  return (
    <div className="w-full">
      {/* ── Category Filter Pills ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeCategory === "all"
              ? "bg-[#1D1D1F] text-white shadow-sm"
              : "bg-white text-[#6E6E73] border border-[#E5E5EA] hover:text-[#1D1D1F]"
          }`}
        >
          All Principles (7 Projects)
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("guardrails")}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeCategory === "guardrails"
              ? "bg-[#0071E3] text-white shadow-sm"
              : "bg-white text-[#6E6E73] border border-[#E5E5EA] hover:text-[#0071E3]"
          }`}
        >
          Strict Guardrails & Limits
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("proof")}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeCategory === "proof"
              ? "bg-[#0071E3] text-white shadow-sm"
              : "bg-white text-[#6E6E73] border border-[#E5E5EA] hover:text-[#0071E3]"
          }`}
        >
          Verifiable Evidence & Testing
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory("flow")}
          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
            activeCategory === "flow"
              ? "bg-[#0071E3] text-white shadow-sm"
              : "bg-white text-[#6E6E73] border border-[#E5E5EA] hover:text-[#0071E3]"
          }`}
        >
          Workflow & Friction Removal
        </button>
      </div>

      {/* ── Main Interactive Canvas (Desktop View) ── */}
      <div className="relative w-full hidden lg:block bg-white rounded-3xl border border-[#E5E5EA] p-8 shadow-xs overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #D1D1D6 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top Hint */}
        <div className="relative z-10 flex items-center justify-between text-[13px] text-[#86868B] mb-4 pb-3 border-b border-[#F5F5F7]">
          <span className="font-medium">
            Click or hover any project to see how its architectural lessons connect to the others.
          </span>
          <span className="text-[12px] font-medium text-[#1D1D1F]">
            Showing connections for: <strong className="text-[#0071E3]">{activeNode.title}</strong>
          </span>
        </div>

        {/* Visual Map Area */}
        <div className="relative w-full h-[580px]">
          {/* SVG Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {allLinks.map((link) => {
              const isRelevant =
                link.from.id === activeNode.id || link.to.id === activeNode.id;
              const matchesCategory =
                activeCategory === "all" ||
                link.from.category === activeCategory ||
                link.to.category === activeCategory;

              const opacity = isRelevant ? 0.9 : matchesCategory ? 0.2 : 0.06;
              const strokeWidth = isRelevant ? 3 : 1.5;
              const strokeColor = isRelevant ? "#0071E3" : "#C7C7CC";

              return (
                <path
                  key={`${link.from.id}-${link.to.id}`}
                  d={`M ${link.from.x}% ${link.from.y}% Q ${(link.from.x + link.to.x) / 2}% ${
                    (link.from.y + link.to.y) / 2 + 6
                  }% ${link.to.x}% ${link.to.y}%`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeDasharray={isRelevant ? undefined : "4 4"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Node Cards on the Canvas */}
          {PRINCIPLES.map((node) => {
            const isSelected = selectedId === node.id;
            const isConnected = connectedIds.has(node.id);
            const matchesCategory =
              activeCategory === "all" || node.category === activeCategory;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute w-[240px] p-4 rounded-2xl transition-all duration-300 cursor-pointer text-left select-none z-10 ${
                  isSelected
                    ? "bg-[#1D1D1F] text-white shadow-xl scale-105 ring-4 ring-[#0071E3]/20 z-20"
                    : isConnected
                    ? "bg-white text-[#1D1D1F] border-2 border-[#0071E3] shadow-md scale-102"
                    : matchesCategory
                    ? "bg-white text-[#1D1D1F] border border-[#E5E5EA] shadow-xs hover:border-[#86868B]"
                    : "bg-white/60 text-[#86868B] border border-[#E5E5EA] opacity-40"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-[#0071E3]" : "text-[#86868B]"
                    }`}
                  >
                    {node.domain}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
                  )}
                </div>

                <h4
                  className={`text-[14px] font-bold tracking-tight leading-snug mb-1.5 line-clamp-1 ${
                    isSelected ? "text-white" : "text-[#1D1D1F]"
                  }`}
                >
                  {node.title}
                </h4>

                <p
                  className={`text-[11px] leading-relaxed line-clamp-2 ${
                    isSelected ? "text-[#D1D1D6]" : "text-[#6E6E73]"
                  }`}
                >
                  {node.summary}
                </p>

                <div
                  className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-semibold ${
                    isSelected
                      ? "border-white/10 text-[#0071E3]"
                      : "border-[#F5F5F7] text-[#0071E3]"
                  }`}
                >
                  <span>{isSelected ? "Active View" : "Click to Connect"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Principle Spotlight Panel (Bottom of Canvas) ── */}
        <div className="mt-6 pt-6 border-t border-[#E5E5EA] bg-[#F5F5F7] rounded-2xl p-5 text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                Selected Principle: {activeNode.domain}
              </span>
              <h3 className="text-[20px] font-bold text-[#1D1D1F] tracking-tight">
                {activeNode.title}
              </h3>
            </div>

            <Link
              to={`/work#${activeNode.caseStudyId}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-[13px] font-semibold text-white bg-[#1D1D1F] hover:bg-[#0071E3] transition-colors"
            >
              <span>View Case Study</span>
            </Link>
          </div>

          <p className="text-[14px] text-[#424245] leading-relaxed mb-4 max-w-3xl">
            {activeNode.summary}
          </p>

          {/* Relationship Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider block">
              How this connects with other projects:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeNode.connectedTo.map((conn) => {
                const targetNode = PRINCIPLES.find((p) => p.id === conn.targetId);
                if (!targetNode) return null;
                return (
                  <div
                    key={conn.targetId}
                    onClick={() => setSelectedId(targetNode.id)}
                    className="p-3 rounded-xl bg-white border border-[#E5E5EA] hover:border-[#0071E3] transition-colors cursor-pointer flex items-start gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#0071E3] flex-shrink-0 mt-1.5" />
                    <div>
                      <span className="text-[12px] font-bold text-[#1D1D1F] block">
                        {targetNode.title}
                      </span>
                      <p className="text-[12px] text-[#6E6E73] leading-normal mt-0.5">
                        {conn.relationship}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile & Tablet Clean Card Flow (< lg screens) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden text-left">
        {PRINCIPLES.filter(
          (p) => activeCategory === "all" || p.category === activeCategory
        ).map((node) => (
          <div
            key={node.id}
            className="bg-white rounded-2xl border border-[#E5E5EA] p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
                  {node.domain}
                </span>
                <Link
                  to={`/work#${node.caseStudyId}`}
                  className="text-[12px] font-semibold text-[#0071E3]"
                >
                  View Case Study
                </Link>
              </div>

              <h4 className="text-[16px] font-bold text-[#1D1D1F] mb-2">
                {node.title}
              </h4>

              <p className="text-[13px] text-[#424245] leading-relaxed mb-4">
                {node.summary}
              </p>

              {/* Connected Insights */}
              <div className="p-3 rounded-xl bg-[#F5F5F7] border border-[#E5E5EA]">
                <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider block mb-1">
                  Connected Principle
                </span>
                <p className="text-[12px] text-[#1D1D1F] leading-normal font-medium">
                  {node.sharedLesson}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
