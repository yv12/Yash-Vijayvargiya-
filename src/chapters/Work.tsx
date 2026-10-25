import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CASE_STUDIES, type CaseStudyProject } from "../data/caseStudies";
import { CaseStudyCarousel } from "../components/case-studies/CaseStudyCarousel";
import { CaseStudyModal } from "../components/case-studies/CaseStudyModal";
import { TakeawaysSection } from "./Takeaways";

export function WorkHeader() { return null; }

export function WorkShowcase() {
  const location = useLocation();
  const [activeProject, setActiveProject] = useState<CaseStudyProject | null>(null);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      const matched = CASE_STUDIES.find(
        (p) => p.id === hash || hash.includes(p.id) || p.id.includes(hash)
      );
      if (matched) setActiveProject(matched);
    }
  }, [location.hash]);

  const handleOpenDossier = (project: CaseStudyProject) => {
    setActiveProject(project);
    window.history.replaceState(null, "", `#${project.id}`);
  };

  const handleCloseDossier = () => {
    setActiveProject(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="bg-[#F5F5F7] font-body text-[#1D1D1F] antialiased">

      {/* ── Hero: exactly one screen tall, everything above the fold ── */}
      <section
        className="relative w-full overflow-hidden flex flex-col items-center justify-between pt-3 pb-2 sm:pt-5 sm:pb-3"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        {/* Compact headline (40 to 52px tall) */}
        <div className="flex-shrink-0 text-center px-4 h-[42px] sm:h-[50px] flex items-center justify-center">
          <h1 className="text-[19px] sm:text-[24px] md:text-[28px] font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-[#D91A5B] via-[#E82B6A] to-[#FF6B55] bg-clip-text text-transparent">
              The case studies.{" "}
            </span>
            <span className="text-[#6E6E73]">
              How I solve problems &amp; ship systems.
            </span>
          </h1>
        </div>

        {/* Carousel takes the leftover height: cards, caption, dots all inside */}
        <div className="flex-1 w-full min-h-0 flex flex-col justify-center items-center overflow-hidden">
          <CaseStudyCarousel
            projects={CASE_STUDIES}
            onOpenDossier={handleOpenDossier}
          />
        </div>
      </section>

      {/* ── Below the fold: Takeaways Section ── */}
      <TakeawaysSection isEmbedded />

      {/* Deep-Dive Modal */}
      <CaseStudyModal
        project={activeProject}
        allProjects={CASE_STUDIES}
        onClose={handleCloseDossier}
        onSelectProject={setActiveProject}
      />
    </div>
  );
}

export function Blinkit() { return null; }
export function Ocr() { return null; }
export function Build() { return null; }
export function Hdfc() { return null; }
export function Fraud() { return null; }
