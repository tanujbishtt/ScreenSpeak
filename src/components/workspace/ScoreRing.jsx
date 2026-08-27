import { useEffect, useState } from "react"

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ANIMATION_MS = 700

function ringColor(score) {
  if (score >= 80) return "#4ade80" // green — great
  if (score >= 50) return "#f0c987" // amber — decent
  return "#f87171" // red — needs work
}

export default function ScoreRing({ score }) {
  // Starts at 0 and counts up to `score` on mount, driving BOTH the number
  // AND the ring fill off the same value every frame — they land in sync,
  // instead of the ring sweeping in via CSS transition while the number
  // just pops straight to its final value.
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()

    // Great score (80+) gets a short vibration pattern timed with the ring
    // finishing its sweep — lands alongside the confetti WorkspacePage
    // already fires, so both "hits" feel like one moment. Silently does
    // nothing on browsers/devices without vibration support (e.g. iOS
    // Safari) — navigator.vibrate just won't exist there.
    if (score >= 80 && navigator.vibrate) {
      window.setTimeout(() => navigator.vibrate([40, 30, 60]), ANIMATION_MS)
    }

    function tick(now) {
      const progress = Math.min((now - start) / ANIMATION_MS, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const offset = CIRCUMFERENCE * (1 - displayScore / 100)

  return (
    <div className="flex animate-score-in items-center gap-2.5">
      <div className="relative h-12 w-12 shrink-0">
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-200 dark:text-white/10"
          />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke={ringColor(score)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
          {displayScore}
        </span>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">fluency score</span>
    </div>
  )
}