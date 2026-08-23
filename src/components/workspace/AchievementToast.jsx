import { useEffect } from "react"
import { Footprints, Flame, Skull, Sparkles, Trophy, Images, X } from "lucide-react"

const ICONS = { Footprints, Flame, Skull, Sparkles, Trophy, Images }

function Toast({ achievement, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(achievement.id), 5000)
    return () => clearTimeout(timer)
  }, [achievement.id, onDismiss])

  const Icon = ICONS[achievement.icon] ?? Trophy

  return (
    <div
      className="
        relative flex w-[min(20rem,calc(100vw-2rem))] animate-achievement-in items-start
        gap-3 rounded-2xl border border-primary/25 bg-surface/95 p-3.5 pr-8
        shadow-[0_18px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl
      "
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        {/* Pulses twice then stops — the "you did something!" beat */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/40 [animation-iteration-count:2] animate-ping"
        />
        <Icon size={18} className="relative" />
      </div>
      <div>
        <p className="text-xs font-medium text-primary">Achievement unlocked</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{achievement.title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{achievement.description}</p>
      </div>
      <button
        onClick={() => onDismiss(achievement.id)}
        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// props: unlocked (array from newlyUnlocked), onDismiss(id)
export default function AchievementToast({ unlocked, onDismiss }) {
  if (unlocked.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 top-[4.5rem] z-100 flex flex-col gap-2.5">
      {unlocked.map((a) => (
        <div key={a.id} className="pointer-events-auto">
          <Toast achievement={a} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}