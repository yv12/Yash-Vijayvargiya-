import { useState } from "react";
import { PrivacyModal } from "./PrivacyNotice";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="w-full bg-clay border-t border-rule py-12 px-6 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-[20px] font-display font-medium text-ink">
              Reach me, find me, locate me.
            </h3>
            <a 
              href="mailto:yashvijay12@hotmail.com" 
              className="text-[15px] font-mono font-bold text-[#A33726] hover:text-ink underline underline-offset-4 transition-colors"
            >
              yashvijay12@hotmail.com
            </a>
          </div>
          
          <div className="flex items-center flex-wrap justify-center gap-6 font-mono text-[14px] font-medium">
            <a href="https://www.linkedin.com/in/yv12/" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-ink transition-colors">
              LinkedIn ↗
            </a>
            <a href="https://github.com/yv12" target="_blank" rel="noopener noreferrer" className="text-graphite hover:text-ink transition-colors">
              GitHub ↗
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
      </footer>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
