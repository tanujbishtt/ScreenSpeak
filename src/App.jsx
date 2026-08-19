import { Route, Routes, useLocation } from "react-router-dom";
import GrainOverlay from "./components/layout/GrainOverlay"

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";
import WorkspacePage from "./pages/WorkspacePage";

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen">
      {/* Site-wide mesh gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-canvas">
        {/* Top left */}
        <div className="absolute -left-32 -top-40 h-125 w-125 rounded-full bg-glow-peach/15 blur-[150px]" />

        {/* Top right */}
        <div className="absolute -right-20 -top-20 h-112.5 w-112.5 rounded-full bg-glow-amber/15 blur-[150px]" />

        {/* Center */}
        <div className="absolute left-[35%] top-[35%] h-125 w-125 rounded-full bg-glow-teal/10 blur-[170px]" />

        {/* Bottom right */}
        <div className="absolute -bottom-32 -right-20 h-125 w-125 rounded-full bg-glow-blue/15 blur-[150px]" />

        {/* Bottom left */}
        <div className="absolute bottom-[15%] left-[10%] h-100 w-100 rounded-full bg-glow-violet/10 blur-[160px]" />
      </div>
      <GrainOverlay />

      {isHome && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>

      {isHome && <Footer />}
    </div>
  );
}

export default App;