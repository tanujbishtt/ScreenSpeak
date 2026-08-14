import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import LandingPage from "./pages/LandingPage"
import WorkspacePage from "./pages/WorkspacePage"

function App() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="min-h-screen relative">
      {/* Site-wide mesh gradient background */}
      <div className="fixed inset-0 -z-10 bg-canvas overflow-hidden">
        <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-[#FE6D73]/25 dark:bg-[#AFFDF0]/10 blur-[130px]" />
        <div className="absolute -top-10 right-0 h-[380px] w-[380px] rounded-full bg-[#FFCB77]/25 dark:bg-[#BEEF8D]/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-[#24E5D2]/25 dark:bg-[#3A745D]/10 blur-[130px]" />
        <div className="absolute -bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-[#2584A7]/25 dark:bg-[#393A4F]/10 blur-[130px]" />
      </div>

      {isHome && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
      {isHome && <Footer />}
    </div>
  )
}

export default App  