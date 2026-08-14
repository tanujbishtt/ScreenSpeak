import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import LandingPage from "./pages/LandingPage"
import WorkspacePage from "./pages/WorkspacePage"

function App() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
      {isHome && <Footer />}
    </div>
  )
}

export default App