import { NoticeBoard } from "../components/takeaways/NoticeBoard";

export function TakeawaysSection({ isEmbedded = false }: { isEmbedded?: boolean }) {
  return (
    <section
      id="takeaways"
      aria-label="AI Product Manager Learnings"
      className={`bg-[#F5F5F7] text-[#1D1D1F] font-body ${
        isEmbedded
          ? "py-12 sm:py-16 border-t border-[#E5E5EA]"
          : "pt-20 sm:pt-24 pb-12 sm:pb-16"
      }`}
    >
      {/* ── Section Header ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center mb-8 sm:mb-10">
        <h1 className="text-[clamp(26px,3.5vw,40px)] font-display font-bold tracking-[-0.03em] leading-[1.15] text-[#1D1D1F] mb-3">
          Takeaways
        </h1>

        <p className="text-[#86868B] text-[14px] sm:text-[15px] leading-relaxed max-w-2xl mx-auto">
          What I learned from shipping real AI and workflow systems into production: how I think about evaluation, guardrails, and human-in-the-loop design.
        </p>
      </div>

      {/* ── Notice Board ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <NoticeBoard />
      </div>
    </section>
  );
}

export function TakeawaysPage() {
  return <TakeawaysSection isEmbedded={false} />;
}
