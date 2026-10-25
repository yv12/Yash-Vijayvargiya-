import { type CaseStudyProject } from "../../data/caseStudies";

interface CaseStudyFiltersProps {
  projects: CaseStudyProject[];
  selectedDiscipline: string;
  onSelectDiscipline: (discipline: string) => void;
  selectedProvenance: string;
  onSelectProvenance: (provenance: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CaseStudyFilters({
  projects,
  selectedDiscipline,
  onSelectDiscipline,
  selectedProvenance,
  onSelectProvenance,
  searchQuery,
  onSearchChange,
}: CaseStudyFiltersProps) {
  // Compute dynamic discipline counts
  const disciplines: { label: string; count: number }[] = [
    { label: "All Disciplines", count: projects.length },
    {
      label: "GenAI & RAG Systems",
      count: projects.filter((p) => p.discipline === "GenAI & RAG Systems").length,
    },
    {
      label: "Product Growth & Discovery",
      count: projects.filter((p) => p.discipline === "Product Growth & Discovery").length,
    },
    {
      label: "Enterprise Vision & Workflow",
      count: projects.filter((p) => p.discipline === "Enterprise Vision & Workflow").length,
    },
    {
      label: "MLOps & Systems",
      count: projects.filter((p) => p.discipline === "MLOps & Systems").length,
    },
  ];

  const provenances = [
    { label: "All Provenance", value: "all", count: projects.length },
    {
      label: "🎓 NextLeap AI PM Fellowship",
      value: "NextLeap AI PM Fellowship",
      count: projects.filter((p) => p.provenance === "NextLeap AI PM Fellowship").length,
    },
    {
      label: "🏢 Client Work (Hestabit NDA)",
      value: "Client Work (Hestabit)",
      count: projects.filter((p) => p.provenance === "Client Work (Hestabit)").length,
    },
    {
      label: "🛠️ Independent Systems",
      value: "Independent System",
      count: projects.filter((p) => p.provenance === "Independent System").length,
    },
  ];

  return (
    <div className="w-full space-y-4 mb-10">
      {/* Top Filter Bar: PM Disciplines & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Discipline Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {disciplines.map((d) => {
            const isActive =
              d.label === "All Disciplines"
                ? selectedDiscipline === "all"
                : selectedDiscipline === d.label;

            return (
              <button
                key={d.label}
                type="button"
                onClick={() =>
                  onSelectDiscipline(d.label === "All Disciplines" ? "all" : d.label)
                }
                className={`flex-shrink-0 text-[13px] font-semibold px-4 py-2 rounded-full border transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-[#1D1D1F] text-[#FFFFFF] border-[#1D1D1F] shadow-sm"
                    : "bg-[#FFFFFF] text-[#6E6E73] border-[#E5E5EA] hover:border-[#1D1D1F]/30 hover:text-[#1D1D1F] shadow-xs"
                }`}
              >
                <span>{d.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-[#F5F5F7] text-[#6E6E73]"
                  }`}
                >
                  {d.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input for Tech & Keywords */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by tech (e.g. Qdrant, PaddleOCR)..."
            className="w-full text-[13px] py-2 pl-9 pr-8 rounded-full border border-[#E5E5EA] bg-[#FFFFFF] text-[#1D1D1F] placeholder-[#86868B] focus:border-[#D91A5B] focus:outline-none focus:ring-1 focus:ring-[#D91A5B] shadow-xs transition-colors"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B] pointer-events-none text-[13px]">
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] text-[13px]"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter: Provenance Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-left">
        <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider self-center flex-shrink-0 mr-1">
          Provenance:
        </span>
        {provenances.map((p) => {
          const isActive = selectedProvenance === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onSelectProvenance(p.value)}
              className={`flex-shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                isActive
                  ? "bg-[#D91A5B]/10 text-[#D91A5B] border-[#D91A5B]/30 font-bold"
                  : "bg-[#FFFFFF] text-[#6E6E73] border-[#E5E5EA] hover:border-black/20 hover:text-[#1D1D1F] shadow-xs"
              }`}
            >
              {p.label} ({p.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
