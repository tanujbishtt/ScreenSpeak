import { wordDiff } from "../../lib/wordDiff"

// props: original (user's sentence), corrected (AI's fixed version)
export default function DiffView({ original, corrected }) {
  if (original.trim() === corrected.trim()) return null // nothing to show

  const { originalTokens, correctedTokens } = wordDiff(original, corrected)
  const hasChanges = originalTokens.some((t) => t.type !== "same")
  if (!hasChanges) return null

  return (
    <div className="mb-2.5 flex animate-message-in flex-col gap-1.5 rounded-xl border-2 border-ink bg-cream-panel p-3 text-sm leading-relaxed">
      <p className="flex flex-wrap gap-x-1">
        {originalTokens.map((token, i) =>
          token.type === "removed" ? (
            <span key={i} className="text-red-500 line-through decoration-2">
              {token.text}
            </span>
          ) : (
            <span key={i} className="text-ink-muted">
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
              className="rounded bg-brut-teal/40 px-1 font-semibold text-ink"
            >
              {token.text}
            </span>
          ) : (
            <span key={i} className="font-medium text-ink">
              {token.text}
            </span>
          ),
        )}
      </p>
    </div>
  )
}