import { useEffect, useState } from "react"

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ANIMATION_MS = 700

function ringColor(score) {
  if (score >= 80) return "#8cbeb2" // brut-teal — great
  if (score >= 50) return "#ffca41" // brut-yellow — decent
  return "#fa7930" // brut-orange — needs work
}

export default function ScoreRing({ score }) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame
    const start = performance.now()

    if (score >= 80 && navigator.vibrate) {
      window.setTimeout(() => navigator.vibrate([40, 30, 60]), ANIMATION_MS)
    }

    function tick(now) {
      const progress = Math.min((now - start) / ANIMATION_MS, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
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
            className="text-ink/15"
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
        <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-bold text-ink">
          {displayScore}
        </span>
      </div>
      <span className="text-xs text-ink-muted">fluency score</span>
    </div>
  )
}