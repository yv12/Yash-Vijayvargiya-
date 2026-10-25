import { useEffect, useState } from "react";
import { type CaseStudyProject } from "../../data/caseStudies";
import { trackProjectClick } from "../../hooks/useClickTracking";

interface CaseStudyModalProps {
  project: CaseStudyProject | null;
  allProjects: CaseStudyProject[];
  onClose: () => void;
  onSelectProject: (project: CaseStudyProject) => void;
}

/* ── FAQ Item Component (Clean Q&A without cards or tabs) ── */
function FAQItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#E5E5EA] last:border-b-0 py-4 sm:py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
      >
        <span className="text-[15px] sm:text-[16px] font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors leading-snug">
          {question}
        </span>
        <span
          className={`text-[#86868B] text-[20px] leading-none flex-shrink-0 transition-transform duration-200 mt-0.5 select-none ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <div className="mt-3 text-[14px] sm:text-[15px] text-[#48484A] leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

export function CaseStudyModal({
  project,
  allProjects,
  onClose,
  onSelectProject,
}: CaseStudyModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeVisualTab, setActiveVisualTab] = useState<"deck" | "blueprint">("deck");

  useEffect(() => {
    setSlideIndex(0);
    setActiveVisualTab(project?.presentationDeck ? "deck" : "blueprint");
  }, [project?.id, project?.presentationDeck]);

  // Handle arrow keys for slide navigation when in deck view
  useEffect(() => {
    if (!project?.presentationDeck || activeVisualTab !== "deck") return;

    const handleSlideKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setSlideIndex((prev) =>
          Math.min(project.presentationDeck!.slides.length - 1, prev + 1)
        );
      }
    };

    window.addEventListener("keydown", handleSlideKeys);
    return () => window.removeEventListener("keydown", handleSlideKeys);
  }, [project?.presentationDeck, activeVisualTab]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const faqs = project.deepDive.faqs || [
    {
      question: `What core problem does ${project.title} solve?`,
      answer: project.problem.description,
    },
    {
      question: "How was the solution architected?",
      answer: project.approach.framework,
    },
    {
      question: "What was the measurable outcome and impact?",
      answer: project.impact.metrics.join("\n"),
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/50 backdrop-blur-md font-body text-[#1D1D1F]"
      style={{ animation: "fadeIn 250ms ease-out" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#F5F5F7]/90 backdrop-blur-sm text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor">
            <path d="M1 1L13 13M1 13L13 1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Scrollable Story Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero & Live Action */}
          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
            {/* Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold text-[#6E6E73] bg-[#F5F5F7] px-3 py-1 rounded-full">
                {project.domain}
              </span>
              <span className="text-[11px] font-semibold text-[#6E6E73] bg-[#F5F5F7] px-3 py-1 rounded-full">
                {project.provenance}
              </span>
              {project.badge && (
                <span className="text-[11px] font-semibold text-[#34C759] bg-[#34C759]/8 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
                  {project.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h2
              id="dossier-title"
              className="text-[26px] sm:text-[32px] font-bold text-[#1D1D1F] tracking-tight leading-[1.15] mb-3"
            >
              {project.title}
            </h2>

            {/* Tagline */}
            <p className="text-[15px] sm:text-[16px] text-[#6E6E73] leading-relaxed max-w-[620px] mb-6">
              {project.tagline}
            </p>

            {/* Live System Action Bar (TOP) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${project.liveLinks.some((l) => l.type !== "nda") ? "bg-[#34C759] animate-pulse" : "bg-[#86868B]"}`} />
                  <h4 className="text-[14px] sm:text-[15px] font-bold text-[#1D1D1F]">
                    {project.liveLinks.some((l) => l.type === "demo")
                      ? "Workflow Demo Available"
                      : project.liveLinks.some((l) => l.type === "live" || l.type === "prototype")
                      ? "Try the live system"
                      : "System Architecture & Specs"}
                  </h4>
                </div>
                <p className="text-[12px] sm:text-[13px] text-[#6E6E73] mt-0.5">
                  {project.liveLinks.some((l) => l.type === "demo")
                    ? "Interactive recording & flow demonstration ready to inspect."
                    : project.liveLinks.some((l) => l.type === "live" || l.type === "prototype")
                    ? "Deployed on cloud infrastructure: test it directly."
                    : "Proprietary enterprise system: architecture and key decisions documented below."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {project.liveLinks.map((link) => {
                  if (link.type === "nda") {
                    return (
                      <span
                        key={link.label}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6E6E73] bg-[#FFFFFF] px-3.5 py-2 rounded-full border border-[#E5E5EA]"
                      >
                        🔒 Enterprise System Under NDA
                      </span>
                    );
                  }
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => {
                        if (link.trackingSlug) trackProjectClick(link.trackingSlug);
                      }}
                      className="inline-flex items-center px-4 py-2.5 rounded-full text-[13px] font-semibold text-white bg-[#1D1D1F] hover:bg-[#0071E3] transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
                    >
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Tech Stack pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider mr-1.5">
                Stack
              </span>
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="text-[11px] text-[#48484A] bg-[#FFFFFF] px-2.5 py-0.5 rounded-full border border-[#E5E5EA] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Impact Metrics Banner */}
          <div
            className="mx-6 sm:mx-10 rounded-2xl px-6 py-5 mb-8"
            style={{
              background: `linear-gradient(135deg, ${project.accentColor}12, ${project.accentColor}06)`,
              border: `1px solid ${project.accentColor}20`,
            }}
          >
            <span
              className="text-[11px] font-bold uppercase tracking-wider mb-3 block"
              style={{ color: project.accentColor }}
            >
              Impact
            </span>
            <div className="space-y-2">
              {project.impact.metrics.map((m, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#34C759] font-bold text-[14px] mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-[14px] sm:text-[15px] text-[#1D1D1F] font-medium leading-snug">
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* The Challenge & The Approach */}
          <div className="px-6 sm:px-10 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <span className="text-[11px] font-bold text-[#D91A5B] uppercase tracking-wider block mb-2">
                  The Challenge
                </span>
                <h3 className="text-[17px] font-bold text-[#1D1D1F] leading-snug mb-2">
                  {project.problem.headline}
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                  {project.problem.description}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#0071E3] uppercase tracking-wider block mb-2">
                  The Approach
                </span>
                <h3 className="text-[17px] font-bold text-[#1D1D1F] leading-snug mb-2">
                  {project.approach.headline}
                </h3>
                <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                  {project.approach.framework}
                </p>
              </div>
            </div>
          </div>

          {/* System Blueprint & Execution Canvas Visual / Presentation Deck */}
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">
                {project.presentationDeck && activeVisualTab === "deck"
                  ? "Project Presentation Deck"
                  : "System Blueprint & Workflow Execution Canvas"}
              </span>

              {/* View Toggle (If both deck & blueprint exist) */}
              {project.presentationDeck && (
                <div className="inline-flex items-center p-0.5 rounded-lg bg-[#E5E5EA]/70 border border-[#D1D1D6]/60 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveVisualTab("deck")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      activeVisualTab === "deck"
                        ? "bg-white text-[#1D1D1F] shadow-xs"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Slides ({project.presentationDeck.slideCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveVisualTab("blueprint")}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      activeVisualTab === "blueprint"
                        ? "bg-white text-[#1D1D1F] shadow-xs"
                        : "text-[#6E6E73] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Blueprint
                  </button>
                </div>
              )}
            </div>

            {/* Presentation Deck Viewer */}
            {project.presentationDeck && activeVisualTab === "deck" ? (() => {
              const deck = project.presentationDeck;
              return (
                <div className="w-full rounded-2xl overflow-hidden border border-[#E5E5EA] bg-[#111827] shadow-lg flex flex-col">
                  {/* Slide Display Area */}
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black flex items-center justify-center overflow-hidden group">
                    <img
                      src={deck.slides[slideIndex]}
                      alt={`${project.title} - Slide ${slideIndex + 1}`}
                      className="w-full h-full object-contain select-none transition-opacity duration-150"
                    />

                    {/* Left Click Hotspot & Arrow */}
                    {slideIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md backdrop-blur-xs"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                    )}

                    {/* Right Click Hotspot & Arrow */}
                    {slideIndex < deck.slides.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setSlideIndex((prev) => Math.min(deck.slides.length - 1, prev + 1))}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md backdrop-blur-xs"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Deck Navigation Toolbar */}
                  <div className="bg-[#1F2937] px-3.5 sm:px-5 py-2.5 flex items-center justify-between border-t border-white/10 text-white select-none">
                    {/* Slide Counter */}
                    <span className="text-[12px] font-medium text-[#9CA3AF]">
                      Slide <span className="text-white font-bold">{slideIndex + 1}</span> of {deck.slideCount}
                    </span>

                    {/* Mini Slide Dots */}
                    <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto py-1">
                      {deck.slides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSlideIndex(i)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            slideIndex === i ? "w-6 bg-[#0071E3]" : "w-1.5 bg-white/30 hover:bg-white/60"
                          }`}
                          title={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Navigation Buttons & Full PDF */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={slideIndex === 0}
                        onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
                        className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Previous (Left arrow)"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        disabled={slideIndex === deck.slides.length - 1}
                        onClick={() => setSlideIndex((prev) => Math.min(deck.slides.length - 1, prev + 1))}
                        className="p-1 rounded text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Next (Right arrow)"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>

                      <a
                        href={deck.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 sm:ml-2 text-[11px] font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                        title="Open full PDF"
                      >
                        <span>Full PDF</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })() : (
              /* Blueprint Image View */
              <div className="w-full rounded-2xl overflow-hidden border border-[#E5E5EA] bg-[#F9FAFB] shadow-xs p-2 sm:p-3 flex items-center justify-center">
                <img
                  src={project.blueprintImage || project.thumbnail}
                  alt={`${project.title} Execution Blueprint`}
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] object-contain rounded-xl"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 sm:mx-10 border-t border-[#E5E5EA]" />

          {/* Project FAQs (Clean Q&A without cards or tabs) */}
          <div className="px-6 sm:px-10 py-8">
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-wider block mb-1">
                Project Deep Dive
              </span>
              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1D1D1F] tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#6E6E73] mt-0.5">
                Questions interviewers and teams ask about this project, with direct answers.
              </p>
            </div>

            <div>
              {faqs.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  question={faq.question}
                  answer={faq.answer}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="px-6 sm:px-10 py-6 border-t border-[#E5E5EA] flex items-center justify-between gap-3">
            <div>
              {prevProject ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(prevProject)}
                  className="text-[13px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors flex items-center cursor-pointer"
                >
                  <span className="hidden sm:inline">
                    {prevProject.title.length > 30 ? prevProject.title.slice(0, 30) + "…" : prevProject.title}
                  </span>
                  <span className="sm:hidden">Previous</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-[13px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] px-4 py-2 rounded-full border border-[#E5E5EA] hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                Close
              </button>

              {nextProject && (
                <button
                  type="button"
                  onClick={() => onSelectProject(nextProject)}
                  className="text-[13px] font-semibold text-[#FFFFFF] bg-[#1D1D1F] hover:bg-black px-4 py-2 rounded-full transition-colors flex items-center cursor-pointer"
                >
                  <span className="hidden sm:inline">
                    {nextProject.title.length > 30 ? nextProject.title.slice(0, 30) + "…" : nextProject.title}
                  </span>
                  <span className="sm:hidden">Next</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
