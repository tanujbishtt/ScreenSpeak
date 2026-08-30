import { Flame, Heart } from "lucide-react"

// props: tone ("roast" | "encourage"), setTone
export default function ToneToggle({ tone, setTone }) {
  return (
    <div className="flex items-center gap-1 rounded-full border-2 border-ink bg-cream-surface p-0.5">
      <button
        onClick={() => setTone("roast")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-semibold transition ${
          tone === "roast"
            ? "bg-ink text-cream"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        <Flame size={12} />
        Roast me
      </button>
      <button
        onClick={() => setTone("encourage")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-semibold transition ${
          tone === "encourage"
            ? "bg-ink text-cream"
            : "text-ink-muted hover:text-ink"
        }`}
      >
        <Heart size={12} />
        Encourage me
      </button>
    </div>
  )
}