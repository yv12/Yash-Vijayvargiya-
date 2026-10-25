import { type CaseStudyProject } from "../../data/caseStudies";

interface CaseStudyCardProps {
  project: CaseStudyProject;
  onOpenDossier: (project: CaseStudyProject) => void;
  isActive?: boolean;
}

export function CaseStudyCard({ project, onOpenDossier, isActive = true }: CaseStudyCardProps) {
  const primaryLiveLink =
    project.liveLinks?.find((l) => l.type === "live" || l.type === "prototype" || l.type === "demo") ||
    project.liveLinks?.[0];

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    if (primaryLiveLink && primaryLiveLink.href && primaryLiveLink.href !== "#") {
      window.open(primaryLiveLink.href, "_blank", "noopener,noreferrer");
    } else {
      onOpenDossier(project);
    }
  };

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isActive) return;
    onOpenDossier(project);
  };

  // Curated clean details line matching discipline • domain
  const detailsMap: Record<string, string> = {
    "hdfc-rag": "GenAI & RAG • Fintech",
    "blinkit-discovery": "Growth & UI/UX • Quick-Commerce",
    "handwritten-ocr": "OCR • Healthcare",
    "commercial-lending": "Workflow Automation & RAG",
    "fraud-ops": "Workflow Automation & RAG",
    "call-audit": "GenAI & Event-Driven Automation • Sales Ops",
    "insurance-rag": "RAG • Insurance Tech",
    "hr-automation": "Event-Driven Automation(n8n) • HR Ops",
  };
  const detailsLine = detailsMap[project.id] || (project.domain ? `${project.discipline} • ${project.domain}` : project.discipline);

  return (
    <article
      onClick={() => {
        if (isActive) onOpenDossier(project);
      }}
      className={`relative flex flex-col w-full h-full bg-[#FFFFFF] border border-[#E5E5EA] overflow-hidden select-none transition-shadow duration-300 ${
        isActive
          ? "cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          : "cursor-pointer shadow-sm"
      }`}
      style={{ borderRadius: 24, aspectRatio: "1 / 1" }}
    >
      {/* ── Top section: Title, Details, Links ── */}
      <div className="flex flex-col flex-shrink-0 px-5 pt-4 pb-2 sm:px-6 sm:pt-5 sm:pb-2.5 text-left">

        {/* Large bold project title (fits up to 2 lines cleanly) */}
        <h2 className="text-[17px] sm:text-[20px] md:text-[22px] font-extrabold text-[#1D1D1F] tracking-tight leading-snug mb-1 line-clamp-2">
          {project.title}
        </h2>

        {/* One line of details */}
        <p className="text-[12px] sm:text-[13px] text-[#6E6E73] font-medium leading-normal mb-2 sm:mb-2.5 line-clamp-1">
          {detailsLine}
        </p>

        {/* Two blue links */}
        <div className="flex items-center gap-4 text-[13px] sm:text-[14px] font-semibold text-[#0071E3]">
          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={handleViewProject}
            className={`inline-flex items-center hover:text-[#0077ED] transition-colors ${
              isActive ? "cursor-pointer" : "pointer-events-none"
            }`}
          >
            <span>View Project</span>
          </button>

          <button
            type="button"
            tabIndex={isActive ? 0 : -1}
            onClick={handleOpenPdf}
            className={`inline-flex items-center hover:text-[#0077ED] transition-colors ${
              isActive ? "cursor-pointer" : "pointer-events-none"
            }`}
          >
            <span>Case Study PDF</span>
          </button>
        </div>
      </div>

      {/* ── Project Image (Framed preview) ── */}
      <div
        className={`relative flex-1 w-full overflow-hidden min-h-0 border-t border-[#E5E5EA] flex items-center justify-center p-2 sm:p-2.5 ${
          project.thumbnail.includes("fundpedia") || project.id === "hdfc-rag"
            ? "bg-[#05110B]"
            : "bg-[#F5F5F7]"
        }`}
      >
        <div
          className={`relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center ${
            project.thumbnail.includes("fundpedia") || project.id === "hdfc-rag"
              ? "bg-[#01140D] border border-white/10 shadow-inner"
              : "bg-white border border-[#E5E5EA]/80 shadow-xs"
          }`}
        >
          <img
            src={project.thumbnail}
            alt={`${project.title} reference`}
            className="w-full h-full object-contain object-center"
            loading="lazy"
          />
        </div>
        {/* Subtle tint overlay when inactive */}
        {!isActive && (
          <div className="absolute inset-0 bg-[#000000]/20 pointer-events-none" />
        )}
      </div>
    </article>
  );
}
