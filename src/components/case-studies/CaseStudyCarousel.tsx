import { useState, useEffect, useCallback, useRef } from "react";
import { type CaseStudyProject } from "../../data/caseStudies";
import { CaseStudyCard } from "./CaseStudyCard";

interface CaseStudyCarouselProps {
  projects: CaseStudyProject[];
  onOpenDossier: (project: CaseStudyProject) => void;
  theme?: "light" | "dark";
}

export function CaseStudyCarousel({ projects, onOpenDossier, theme = "light" }: CaseStudyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardSize, setCardSize] = useState(380);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Compute cardSize dynamically so all 3 cards fit completely without slicing
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerH = rect.height;
    const containerW = rect.width;

    const mobile = containerW < 768;
    setIsMobile(mobile);

    // Reserved height for dots (~32px) and margins (~48px) = ~80px
    const availableH = containerH - 80;

    let computed: number;
    if (mobile) {
      const maxW = containerW - 32;
      computed = Math.max(220, Math.min(Math.round(availableH), Math.round(maxW), 380));
    } else {
      // Fit all 3 cards: cardSize + 2 * sideSize + 2 * gap <= containerW - 64
      // With sideSize = cardSize * 0.82 and gap = 20: 2.64 * cardSize + 40 <= containerW - 64
      const maxCardWToFitThree = Math.floor((containerW - 104) / 2.64);
      computed = Math.max(220, Math.min(Math.round(availableH), maxCardWToFitThree, 420));
    }
    setCardSize(computed);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const ro = new ResizeObserver(updateDimensions);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      ro.disconnect();
    };
  }, [updateDimensions]);

  const total = projects.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Dimensions for side cards (82% size) and gap
  const sideSize = Math.round(cardSize * 0.82);
  const gap = 20;

  const TRANSITION = reducedMotion
    ? "none"
    : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1), width 500ms cubic-bezier(0.4, 0, 0.2, 1), height 500ms cubic-bezier(0.4, 0, 0.2, 1), filter 500ms ease, opacity 500ms ease, margin-top 500ms cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full flex flex-col justify-between items-center select-none"
    >
      {/* ── 2. Carousel Stage (Takes exact leftover height) ── */}
      <div
        className="relative w-full flex items-center justify-center flex-1 min-h-0 py-2"
      >
        <div
          className="relative w-full"
          style={{ height: cardSize }}
        >
          {projects.map((project, idx) => {
            // Compute wrapped slot index relative to activeIndex (-N/2 to N/2)
            let slot = idx - activeIndex;
            while (slot > total / 2) slot -= total;
            while (slot < -total / 2) slot += total;

            const isActive = slot === 0;
            const isLeft = slot === -1;
            const isRight = slot === 1;
            const isVisible = isMobile ? isActive : Math.abs(slot) <= 1;

            let offsetX = 0;
            let opacity = 1;
            let blurPx = 0;
            let zIndex = 1;
            let width = sideSize;
            let height = sideSize;

            if (isActive) {
              offsetX = 0;
              opacity = 1;
              blurPx = 0;
              zIndex = 10;
              width = cardSize;
              height = cardSize;
            } else if (isLeft) {
              offsetX = -(cardSize / 2 + gap + sideSize / 2);
              opacity = 0.88;
              blurPx = 0;
              zIndex = 5;
              width = sideSize;
              height = sideSize;
            } else if (isRight) {
              offsetX = cardSize / 2 + gap + sideSize / 2;
              opacity = 0.88;
              blurPx = 0;
              zIndex = 5;
              width = sideSize;
              height = sideSize;
            } else if (slot === -2) {
              offsetX = -(cardSize / 2 + gap + sideSize * 1.5 + gap);
              opacity = 0;
              blurPx = 0;
              zIndex = 2;
              width = sideSize;
              height = sideSize;
            } else if (slot === 2) {
              offsetX = cardSize / 2 + gap + sideSize * 1.5 + gap;
              opacity = 0;
              blurPx = 0;
              zIndex = 2;
              width = sideSize;
              height = sideSize;
            } else {
              offsetX = slot > 0 ? 9999 : -9999;
              opacity = 0;
              zIndex = 0;
              width = sideSize;
              height = sideSize;
            }

            const transform = `translateX(calc(-50% + ${offsetX}px))`;
            const marginTop = isActive ? 0 : Math.round((cardSize - sideSize) / 2);

            // Elevated Apple-style drop shadow
            const cardShadow = isActive
              ? "0 22px 45px -10px rgba(0, 0, 0, 0.22), 0 10px 20px -6px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.05)"
              : "0 12px 28px -8px rgba(0, 0, 0, 0.14), 0 6px 12px -4px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)";

            return (
              <div
                key={project.id}
                onClick={() => {
                  if (!isActive) setActiveIndex(idx);
                }}
                aria-hidden={!isActive}
                aria-label={project.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width,
                  height,
                  marginTop,
                  transform,
                  filter: !reducedMotion && blurPx > 0 ? `blur(${blurPx}px)` : "none",
                  opacity: isVisible ? opacity : 0,
                  zIndex,
                  cursor: isActive ? "default" : "pointer",
                  pointerEvents: isVisible ? "auto" : "none",
                  transition: TRANSITION,
                  borderRadius: 24,
                  boxShadow: cardShadow,
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 24, overflow: "hidden" }}>
                  <CaseStudyCard
                    project={project}
                    onOpenDossier={onOpenDossier}
                    isActive={isActive}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dots & Navigation Controls ── */}
      <div className="flex-shrink-0 flex items-center justify-center gap-3 mt-2 mb-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous project"
          className={`px-2.5 py-1 rounded-full shadow-xs flex items-center justify-center text-[11px] font-medium transition-transform active:scale-95 cursor-pointer ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              : "bg-white/80 hover:bg-white border border-[#E5E5EA] text-[#1D1D1F]"
          }`}
        >
          Prev
        </button>

        {/* Small gradient dots, active dark pill with thin black outline */}
        <div className="flex items-center gap-1.5 px-1 py-1" role="tablist" aria-label="Project selection">
          {projects.map((project, idx) => {
            const isDotActive = idx === activeIndex;
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isDotActive}
                aria-label={`Go to ${project.title}`}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isDotActive
                    ? theme === "dark"
                      ? "w-7 h-2.5 bg-white ring-1 ring-white/50 shadow-sm"
                      : "w-7 h-2.5 bg-[#1D1D1F] ring-1 ring-black shadow-xs"
                    : theme === "dark"
                    ? "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                    : "w-2.5 h-2.5 bg-gradient-to-b from-[#D1D1D6] to-[#AEAEB2] hover:opacity-80"
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next project"
          className={`px-2.5 py-1 rounded-full shadow-xs flex items-center justify-center text-[11px] font-medium transition-transform active:scale-95 cursor-pointer ${
            theme === "dark"
              ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              : "bg-white/80 hover:bg-white border border-[#E5E5EA] text-[#1D1D1F]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
