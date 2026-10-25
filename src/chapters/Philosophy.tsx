import { contact } from "../content";

const PRINCIPLES = [
  {
    number: "01",
    title: "Context dictates the pace.",
    summary:
      "In consumer apps, moving fast and breaking things is acceptable. In wealth management and fraud operations, being fast and wrong is fatal. The operating cadence must always match the real cost of being wrong.",
  },
  {
    number: "02",
    title: "The friction shapes the architecture.",
    summary:
      "You cannot force a retail discovery ladder into an enterprise legal workflow. Real product design does not start with templates. It starts by locating the exact user friction and engineering the simplest mechanism to eliminate it.",
  },
  {
    number: "03",
    title: "Evidence over assumption.",
    summary:
      "Opinions in conference rooms are cheap. Production metrics, user drop-off data, and live edge cases settle debates. Build the smallest testable loop, verify the ground truth, and let reality guide the roadmap.",
  },
];

export function PhilosophySection() {
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_PHONE || contact.whatsappPhone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  return (
    <section
      id="philosophy"
      aria-label="Product Philosophy"
      className="relative bg-[#000000] text-white py-12 sm:py-16 px-4 sm:px-8 overflow-hidden border-t border-white/10"
    >
      {/* Top subtle ambient spotlight glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-[clamp(24px,3.2vw,36px)] font-display font-bold tracking-[-0.03em] leading-[1.15] text-[#F5F5F7] mb-3">
            No borrowed playbooks.
          </h2>

          <p className="text-[15px] sm:text-[17px] text-[#A1A1A6] font-display font-medium leading-snug mb-3">
            Every product demands its own method.
          </p>

          <p className="text-[#86868B] text-[13px] sm:text-[14px] font-body leading-relaxed max-w-2xl mx-auto">
            Off-the-shelf frameworks assume clean data, predictable users, and forgiving environments. Real production offers none of these. When an advisory tool guesses, it violates compliance. When an OCR engine transcribes a signature, it destroys legal proof. When a quick-commerce feed overwhelms a buyer, it kills the sale.
          </p>
        </div>

        {/* ── Three First-Principle Pillars (Plain Typography) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 text-left">
          {PRINCIPLES.map((p) => (
            <div key={p.number} className="flex flex-col">
              <span className="font-display font-bold text-[13px] sm:text-[14px] text-[#86868B] block mb-2 sm:mb-2.5 tracking-wider">
                {p.number}
              </span>

              <h3 className="font-display font-bold text-[18px] sm:text-[20px] text-[#F5F5F7] tracking-tight leading-snug mb-3">
                {p.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] text-[#86868B] leading-relaxed font-body">
                {p.summary}
              </p>
            </div>
          ))}
        </div>

        {/* ── Closing Executive Punchline ── */}
        <div className="max-w-3xl mx-auto text-center pt-8 sm:pt-10 border-t border-white/10">
          <p className="font-display text-[18px] sm:text-[22px] font-semibold text-[#F5F5F7] tracking-tight leading-snug mb-2">
            I do not bring a rigid framework to your team.
          </p>
          <p className="text-[#86868B] text-[13px] sm:text-[15px] font-body leading-relaxed mb-6">
            I build the exact framework your problem demands.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-display font-semibold py-2.5 px-5 rounded-full text-[13px] sm:text-[14px] transition-all shadow-md hover:shadow-lg"
          >
            <span>Discuss on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
