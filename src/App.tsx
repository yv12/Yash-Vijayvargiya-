import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Opening,
  LandingDarkSection,
  Between,
  RealProblem,
  Rag,
  Speed,
  Principles,
  StoryHeader,
} from "./chapters/Story";
import { WorkShowcase } from "./chapters/Work";
import { TakeawaysPage, TakeawaysSection } from "./chapters/Takeaways";
import { PhilosophySection } from "./chapters/Philosophy";
import { Systems, Direction, VisionHeader } from "./chapters/Close";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { PrivacyPage } from "./components/PrivacyNotice";
import { AdminDashboard } from "./components/AdminDashboard";
import { trackPageView } from "./hooks/useClickTracking";
import { useLiveFavicon } from "./hooks/useLiveFavicon";

function LiveFaviconController() {
  useLiveFavicon();
  return null;
}

function PageTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <main className="bg-[#F5F5F7] min-h-screen">
      {!isAdminRoute && <Navigation />}
      <Routes>
        <Route path="/" element={
          <>
            <Opening />
            <LandingDarkSection />
            <TakeawaysSection isEmbedded />
            <PhilosophySection />
          </>
        } />
        <Route path="/story" element={
          <>
            <StoryHeader />
            <Between />
            <RealProblem />
            <Rag />
            <Speed />
            <Principles />
          </>
        } />
        <Route path="/work" element={<WorkShowcase />} />
        <Route path="/takeaways" element={<TakeawaysPage />} />
        <Route path="/vision" element={
          <>
            <VisionHeader />
            <Systems />
            <Direction />
          </>
        } />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <LiveFaviconController />
      <PageTracker />
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}
