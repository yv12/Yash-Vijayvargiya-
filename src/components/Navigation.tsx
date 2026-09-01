import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  // Don't show the back button on the homepage
  if (location.pathname === "/") return null;

  return (
    <div className="fixed top-6 left-6 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 bg-paper/90 backdrop-blur-md border border-rule px-4 py-2 rounded-full text-[14px] font-mono font-medium text-ink shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        <span aria-hidden="true">←</span> Back to Home
      </Link>
    </div>
  );
}
