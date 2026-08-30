import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

// props: size - icon px size (default 15, matches other header icon buttons)
export default function ThemeToggle({ size = 15 }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        flex h-8 w-8 items-center justify-center rounded-full
        border-2 border-ink bg-cream-surface text-ink
        shadow-brutal-sm transition-all
        hover:-translate-y-0.5
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
      "
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span key={theme} className="flex animate-theme-pop items-center justify-center">
        {theme === "dark" ? <Sun size={size} /> : <Moon size={size} />}
      </span>
    </button>
  )
}