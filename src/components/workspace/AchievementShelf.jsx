import { useState, useRef, useEffect } from "react"
import { Trophy, Footprints, Flame, Skull, Sparkles, Images, Lock } from "lucide-react"

const ICONS = { Footprints, Flame, Skull, Sparkles, Trophy, Images }

// props: achievements (array with .unlocked from useAchievements)
export default function AchievementShelf({ achievements }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-surface dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Achievements"
      >
        <Trophy size={14} />
        <span className="hidden sm:inline">{unlockedCount}/{achievements.length}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-100 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
          <p className="mb-2 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Achievements — {unlockedCount}/{achievements.length}
          </p>
          <div className="flex flex-col gap-1">
            {achievements.map((a) => {
              const Icon = ICONS[a.icon] ?? Trophy
              return (
                <div
                  key={a.id}
                  className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 ${
                    a.unlocked ? "" : "opacity-40"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      a.unlocked
                        ? "bg-primary/15 text-primary"
                        : "bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                    }`}
                  >
                    {a.unlocked ? <Icon size={15} /> : <Lock size={13} />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">{a.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}