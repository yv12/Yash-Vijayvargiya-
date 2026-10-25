import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { contact } from "../content";
import { trackButtonClick } from "../hooks/useClickTracking";

export function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 15);

      if (!isHome) return;

      const caseStudiesEl = document.getElementById("case-studies");
      const takeawaysEl = document.getElementById("takeaways");
      const scrollPos = scrollY + 200;

      if (takeawaysEl && scrollPos >= takeawaysEl.offsetTop) {
        setActiveSection("takeaways");
      } else if (caseStudiesEl && scrollPos >= caseStudiesEl.offsetTop) {
        setActiveSection("case-studies");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleScrollTo = (e: React.MouseEvent, sectionId: string) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${sectionId}`);
        setActiveSection(sectionId);
      }
    }
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setActiveSection("");
    }
  };

  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_PHONE || contact.whatsappPhone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent backdrop-blur-none border-b border-transparent shadow-none"
          : "bg-[#F5F5F7]/85 backdrop-blur-md border-b border-[#E5E5EA]/70 shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-15 flex items-center justify-between">
        {/* Top Left: Name */}
        <Link
          to="/"
          onClick={handleScrollToTop}
          className={`group flex items-center gap-2 font-display font-semibold text-[15px] sm:text-[17px] tracking-tight hover:opacity-80 transition-all ${
            isTransparent ? "text-white" : "text-[#1D1D1F]"
          }`}
          aria-label="Yash Vijayvargiya Home"
        >
          <span>Yash Vijayvargiya</span>
        </Link>

        {/* Top Right: Menus */}
        <nav className={`flex items-center gap-2 sm:gap-4 font-display text-[13px] sm:text-[14px] font-medium ${
          isTransparent ? "text-white" : "text-[#1D1D1F]"
        }`}>
          <Link
            to="/#case-studies"
            onClick={(e) => handleScrollTo(e, "case-studies")}
            className={`transition-colors px-2 py-1 ${
              (isHome && activeSection === "case-studies") || location.pathname === "/work"
                ? isTransparent ? "text-amber-300 font-semibold" : "text-[#0071E3] font-semibold"
                : isTransparent ? "text-white/80 hover:text-white" : "text-[#1D1D1F] hover:text-[#0071E3]"
            }`}
          >
            Case Studies
          </Link>

          <Link
            to="/#takeaways"
            onClick={(e) => handleScrollTo(e, "takeaways")}
            className={`transition-colors px-2 py-1 ${
              (isHome && activeSection === "takeaways") || location.pathname === "/takeaways"
                ? isTransparent ? "text-amber-300 font-semibold" : "text-[#0071E3] font-semibold"
                : isTransparent ? "text-white/80 hover:text-white" : "text-[#1D1D1F] hover:text-[#0071E3]"
            }`}
          >
            Takeaways
          </Link>

          {/* Interview Me Action Button - Direct WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackButtonClick("interview-me-whatsapp")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all shadow-sm hover:shadow ${
              isTransparent
                ? "border border-white/25 bg-white/10 hover:bg-white/20 text-white"
                : "border border-[#0071E3]/35 bg-[#0071E3]/[0.08] hover:bg-[#0071E3]/[0.15] text-[#0071E3]"
            }`}
            title="Chat directly on WhatsApp"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.029-.475-1.636-.679-2.684-2.339-2.766-2.449-.081-.11-.663-.883-.663-1.683s.42-.1.192.571-1.396c.153-.162.334-.203.447-.203.113 0 .227.002.326.007.104.005.244-.04.382.292.144.346.49 1.196.533 1.284.043.088.072.19.014.305-.058.115-.087.187-.174.289-.087.102-.183.228-.261.306-.088.088-.179.183-.077.359.102.175.454.749.974 1.213.67.597 1.235.782 1.41.87.175.088.277.073.38-.044.103-.117.438-.511.555-.686.117-.175.234-.146.394-.088.16.058 1.017.479 1.192.566.175.087.292.131.335.204.043.073.043.424-.101.829z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.628 0-3.14-.492-4.407-1.336l-.316-.211-2.962.83.844-2.885-.23-.33A7.994 7.994 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8.05-8 8.05z"/>
            </svg>
            <span>Interview Me</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
