import { useEffect } from "react"
import { X } from "lucide-react"
import { ACHIEVEMENT_ICONS } from "../../lib/achievementIcons"

function Toast({ achievement, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(achievement.id), 5000)
    return () => clearTimeout(timer)
  }, [achievement.id, onDismiss])

  const Icon = ACHIEVEMENT_ICONS[achievement.icon] ?? ACHIEVEMENT_ICONS.Trophy

  return (
    <div
      className="
        relative flex w-[min(20rem,calc(100vw-2rem))] animate-achievement-in items-start
        gap-3 rounded-2xl border-2 border-ink bg-cream-surface p-3.5 pr-8
        shadow-brutal-lg
      "
    >
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-brut-yellow text-ink">
        {/* Pulses twice then stops — the "you did something!" beat */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brut-yellow/60 [animation-iteration-count:2] animate-ping"
        />
        <Icon size={18} className="relative" />
      </div>
      <div>
        <p className="font-display text-xs font-semibold text-brut-orange">Achievement unlocked</p>
        <p className="font-display text-sm font-semibold text-ink">{achievement.title}</p>
        <p className="text-xs text-ink-muted">{achievement.description}</p>
      </div>
      <button
        onClick={() => onDismiss(achievement.id)}
        className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink"
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