import { X, Home, Sun, Moon } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import Logo from "../layout/Logo"

export default function Sidebar({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200/60 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-semibold text-slate-900 dark:text-white">SceneSpeak</span>
          </Link>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
            <Home size={16} />
            Home
          </Link>

          <button onClick={toggleTheme} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Sessions</h4>
              <span className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 px-2 py-0.5 rounded-full">Soon</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Sign in to save and revisit past sessions.</p>
          </div>
        </div>
      </div>
    </>
  )
}