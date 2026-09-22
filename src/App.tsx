import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Opening,
  Between,
  RealProblem,
  Rag,
  Speed,
  Principles,
  StoryHeader,
} from "./chapters/Story";
import { Blinkit, Ocr, Build, Hdfc, Fraud, WorkHeader } from "./chapters/Work";
import { Systems, Direction, VisionHeader } from "./chapters/Close";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { PrivacyPage } from "./components/PrivacyNotice";
import { AdminDashboard } from "./components/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <main>
      {!isAdminRoute && <Navigation />}
      <Routes>
        <Route path="/" element={<Opening />} />
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
        <Route path="/work" element={
          <>
            <WorkHeader />
            <Blinkit />
            <Ocr />
            <Build />
            <Hdfc />
            <Fraud />
          </>
        } />
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
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}
