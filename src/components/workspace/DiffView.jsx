import { wordDiff } from "../../lib/wordDiff"

// props: original (user's sentence), corrected (AI's fixed version)
export default function DiffView({ original, corrected }) {
  if (original.trim() === corrected.trim()) return null // nothing to show

  const { originalTokens, correctedTokens } = wordDiff(original, corrected)
  const hasChanges = originalTokens.some((t) => t.type !== "same")
  if (!hasChanges) return null

  return (
    <div className="mb-2.5 flex animate-message-in flex-col gap-1.5 rounded-xl bg-canvas/60 p-3 text-sm leading-relaxed dark:bg-black/20">
      <p className="flex flex-wrap gap-x-1">
        {originalTokens.map((token, i) =>
          token.type === "removed" ? (
            <span key={i} className="text-red-500 line-through decoration-2 dark:text-red-400">
              {token.text}
            </span>
          ) : (
            <span key={i} className="text-slate-500 dark:text-slate-400">
              {token.text}
            </span>
          ),
        )}
      </p>
      <p className="flex flex-wrap gap-x-1">
        {correctedTokens.map((token, i) =>
          token.type === "added" ? (
            <span
              key={i}
              className="rounded bg-green-500/15 px-1 font-medium text-green-700 dark:bg-green-400/15 dark:text-green-400"
            >
              {token.text}
            </span>
          ) : (
            <span key={i} className="font-medium text-slate-800 dark:text-white">
              {token.text}
            </span>
          ),
        )}
      </p>
    </div>
  )
}