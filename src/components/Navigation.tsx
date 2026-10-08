import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  // Don't show the back button on the homepage
  if (location.pathname === "/") return null;

  return (
    <div className="fixed top-2.5 left-3 sm:top-3.5 sm:left-6 z-50">
      <Link
        to="/"
        className="group flex items-center gap-1.5 sm:gap-2 bg-paper border border-[#12151A]/25 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-[12px] sm:text-[14px] font-mono font-bold text-ink shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:border-signal transition-all"
        aria-label="Return to Homepage"
      >
        <span aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform text-signal font-bold">←</span>
        <span>Home</span>
      </Link>
    </div>
  );
}
