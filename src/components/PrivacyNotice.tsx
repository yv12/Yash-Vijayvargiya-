export function PrivacyContent() {
  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div>
        <h2 className="text-[26px] font-display font-medium text-ink">
          Privacy Notice
        </h2>
        <p className="font-mono text-[12px] text-graphite mt-1">
          Last updated: September 2026 · Plain language, no jargon
        </p>
      </div>

      <div className="space-y-4 text-[15px] leading-relaxed text-ink/90">
        <section>
          <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-graphite">
            1. What is collected when you click a project
          </h3>
          <p className="mt-1.5">
            When you click &ldquo;View live&rdquo; or launch a project demo, the following minimal signals are logged:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-graphite font-mono text-[13px]">
            <li><strong>Project slug:</strong> Which case study or project link was clicked</li>
            <li><strong>Timestamp:</strong> Date and time of the click</li>
            <li><strong>Device &amp; Browser:</strong> Standard user-agent header (e.g. Chrome on macOS, Safari on iOS)</li>
            <li><strong>Referring page:</strong> Where you came from (e.g. LinkedIn, direct link, resume)</li>
            <li><strong>Engagement signals:</strong> Time spent on page before clicking and scroll depth percentage</li>
            <li><strong>Viewport:</strong> Screen dimensions (to distinguish desktop vs mobile layouts)</li>
            <li>
              <strong>Masked IP address:</strong> The last octet of your IP is permanently zeroed out/masked (e.g.&nbsp;
              <code className="bg-paper-dark/30 px-1 py-0.5 rounded text-ink">203.0.113.xxx</code>) before writing to disk. Full IP addresses are never saved.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-graphite">
            2. Why this is collected
          </h3>
          <p className="mt-1.5 text-graphite">
            To understand which projects and prototypes visitors find engaging, and whether case study narratives successfully lead people to explore the live software.
          </p>
        </section>

        <section>
          <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-graphite">
            3. What is NOT collected
          </h3>
          <p className="mt-1.5 text-graphite">
            No names, no emails, no account logins, no browser fingerprinting, and zero tracking cookies. There are no Google Analytics, no Meta pixels, and no ad network scripts running on this site.
          </p>
        </section>

        <section>
          <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-graphite">
            4. Data Retention &amp; Storage
          </h3>
          <p className="mt-1.5 text-graphite">
            Records are stored in an append-only log file on a self-hosted, private server volume. Entries older than <strong>90 days</strong> are automatically pruned and permanently deleted. No external database or cloud analytics provider processes this log.
          </p>
        </section>

        <section>
          <h3 className="font-mono text-[13px] font-bold uppercase tracking-wider text-graphite">
            5. Deletion &amp; Questions
          </h3>
          <p className="mt-1.5 text-graphite">
            For any questions or deletion requests, email{" "}
            <a
              href="mailto:yashvijay12@hotmail.com"
              className="text-[#1B3AC7] underline underline-offset-2 hover:text-ink font-mono font-medium"
            >
              yashvijay12@hotmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

export function PrivacyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Notice"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-paper border border-rule shadow-2xl p-6 sm:p-8 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close privacy notice"
          className="absolute top-4 right-4 text-graphite hover:text-ink font-mono text-[18px] p-2"
        >
          ✕
        </button>
        <PrivacyContent />
        <div className="mt-8 pt-4 border-t border-rule flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn py-1.5 px-4 text-[14px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-sand px-6 py-24">
      <div className="max-w-2xl mx-auto bg-paper border border-rule p-8 sm:p-12 shadow-sm rounded-lg">
        <a
          href="/"
          className="inline-block font-mono text-[13px] text-[#1B3AC7] hover:underline mb-8"
        >
          ← Back to home
        </a>
        <PrivacyContent />
      </div>
    </main>
  );
}
