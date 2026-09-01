import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  Opening,
  Between,
  RealProblem,
  Rag,
  Speed,
  Principles,
} from "./chapters/Story";
import { Blinkit, Ocr, Build, Hdfc, Fraud } from "./chapters/Work";
import { Systems, Direction, Closing } from "./chapters/Close";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <main>
        <Navigation />
        <Routes>
          <Route path="/" element={<Opening />} />
          <Route path="/story" element={
            <>
              <Between />
              <RealProblem />
              <Rag />
              <Speed />
              <Principles />
            </>
          } />
          <Route path="/work" element={
            <>
              <Blinkit />
              <Ocr />
              <Build />
              <Hdfc />
              <Fraud />
            </>
          } />
          <Route path="/vision" element={
            <>
              <Systems />
              <Direction />
            </>
          } />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}
