import { Flame, Heart } from "lucide-react"

// props: tone ("roast" | "encourage"), setTone
export default function ToneToggle({ tone, setTone }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-canvas p-0.5">
      <button
        onClick={() => setTone("roast")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
          tone === "roast"
            ? "bg-primary text-primary-foreground"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <Flame size={12} />
        Roast me
      </button>
      <button
        onClick={() => setTone("encourage")}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
          tone === "encourage"
            ? "bg-primary text-primary-foreground"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        <Heart size={12} />
        Encourage me
      </button>
    </div>
  )
}