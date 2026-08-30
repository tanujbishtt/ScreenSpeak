import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./pages/LandingPage";

const WorkspacePage = lazy(() => import("./pages/WorkspacePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`relative min-h-screen ${isHome ? "font-display" : ""}`}>
      {isHome && <div className="fixed inset-0 -z-10 bg-cream" />}

      {isHome && <Navbar />}

      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>

      {isHome && <Footer />}
    </div>
  );
}

export default App;