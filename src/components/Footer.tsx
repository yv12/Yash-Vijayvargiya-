import { useState } from "react";
import { PrivacyModal } from "./PrivacyNotice";
import { contact } from "../content";
import { trackButtonClick } from "../hooks/useClickTracking";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="w-full bg-[#F5F5F7] border-t border-[#E5E5EA] py-10 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[18px] font-display font-medium text-ink">
              Reach me, find me, locate me.
            </h3>
            <a 
              href="mailto:yashvijay12@hotmail.com" 
              onClick={() => trackButtonClick("email")}
              className="text-[14px] font-display font-semibold text-[#0071E3] hover:underline underline-offset-4 transition-colors"
            >
              yashvijay12@hotmail.com
            </a>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-6 font-display text-[13px] sm:text-[14px] font-medium">
            <a 
              href="https://www.linkedin.com/in/yv12/" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => trackButtonClick("linkedin")}
              className="text-graphite hover:text-ink transition-colors"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/yv12" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => trackButtonClick("github")}
              className="text-graphite hover:text-ink transition-colors"
            >
              GitHub
            </a>
            <a
              href={`https://wa.me/${contact.whatsappPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(contact.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackButtonClick("whatsapp")}
              className="text-[#15803D] hover:text-[#166534] font-semibold transition-colors inline-flex items-center gap-1"
            >
              <span>WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="text-graphite hover:text-ink underline underline-offset-4 transition-colors cursor-pointer"
            >
              Privacy Notice
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-3 text-center">
          <p className="text-[11px] sm:text-[12px] font-display text-graphite/60">
            © 2026 Yash Vijayvargiya
          </p>
        </div>
      </footer>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
