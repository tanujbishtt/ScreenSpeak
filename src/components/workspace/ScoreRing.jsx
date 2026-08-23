// A circle's edge length is 2 * PI * radius. We draw the ring as a dashed
// stroke where the dash length = the full circle, and we control how much
// of that dash is "filled in" via strokeDashoffset — offsetting by
// (1 - percentage) of the circle hides that much of the stroke, which is
// the standard SVG trick for a progress ring.
const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ringColor(score) {
  if (score >= 80) return "#4ade80" // green — great
  if (score >= 50) return "#f0c987" // amber — decent
  return "#f87171" // red — needs work
}

export default function ScoreRing({ score }) {
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="flex items-center gap-2.5">
      {/* relative wrapper + absolutely-centered number is the standard way
          to overlay text on top of an SVG shape */}
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
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
          {score}
        </span>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">fluency score</span>
    </div>
  )
}