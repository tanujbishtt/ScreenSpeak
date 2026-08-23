import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

// props:
//   size      — icon size (default 18)
//   className — colors/hover styling, merged onto the button so it still
//               matches whichever surface it sits on (glassy navbar vs
//               plain workspace header)
export default function ThemeToggle({ size = 18, className = "" }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ${className}`}
    >
      {/* One-shot "lamp flash" behind the icon. `key={theme}` forces this
          span to unmount/remount every toggle, which restarts animate-ping
          from scratch each time — that's the trick, no extra state needed.
          [animation-iteration-count:1] stops Tailwind's normally-infinite ping. */}
      <span
        key={theme}
        aria-hidden
        className={`absolute inset-0 rounded-full [animation-iteration-count:1] animate-ping ${
          theme === "dark" ? "bg-primary/30" : "bg-amber-300/50"
        }`}
      />
      {/* Same remount trick for the icon itself — replays the bounce/rotate
          pop every time the theme actually changes. */}
      <span key={`${theme}-icon`} className="relative flex animate-theme-pop">
        {theme === "dark" ? <Sun size={size} /> : <Moon size={size} />}
      </span>
    </button>
  )
}