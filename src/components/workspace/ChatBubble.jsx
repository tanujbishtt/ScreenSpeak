import { memo } from "react"
import { RotateCcw, Sparkles } from "lucide-react"
import Logo from "../layout/Logo"
import ScoreRing from "./ScoreRing"
import DiffView from "./DiffView"

function ChatBubble({ message, onRegenerate, isRegenerating }) {
  const { role, content, isTemplate, displayLabel, canRegenerate, score, corrected, originalText } = message

  if (role === "user" && isTemplate) {
    return (
      <div className="flex animate-message-in justify-end">
        <div className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-brut-yellow/50 px-4 py-1.5 font-display text-sm font-medium text-ink">
          <Sparkles size={12} />
          {displayLabel}
        </div>
      </div>
    )
  }

  if (role === "user") {
    return (
      <div className="flex animate-message-in justify-end">
        <div
          className="
            max-w-[80%]
            rounded-2xl rounded-br-md
            border-2 border-ink bg-ink
            px-4 py-3
            text-[15px] leading-6
            text-cream
            shadow-brutal-sm
          "
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex animate-message-in justify-start gap-1">
      <div className="mt-1 shrink-0">
        <Logo size={46} />
      </div>

      <div
        className="
          max-w-[80%]
          rounded-2xl rounded-bl-md
          border-2 border-ink
          bg-cream-surface
          px-4 py-3
          text-[15px] leading-6
          text-ink
          shadow-brutal-sm
        "
      >
        {typeof score === "number" && (
          <div className="mb-2.5 border-b-2 border-ink/15 pb-2.5">
            <ScoreRing score={score} />
          </div>
        )}
        {typeof score === "number" && corrected && originalText && (
          <DiffView original={originalText} corrected={corrected} />
        )}
        {content}
        {canRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="
              -ml-2 mt-2.5 flex items-center gap-1.5 rounded-full
              px-2 py-1 font-display text-xs font-medium text-ink-muted transition-all
              hover:bg-cream-panel hover:text-ink
              active:scale-90 disabled:opacity-50
            "
          >
            <RotateCcw size={12} className={isRegenerating ? "animate-spin" : ""} />
            {isRegenerating ? "Regenerating..." : "Try another"}
          </button>
        )}
      </div>
    </div>
  )
}

export default memo(ChatBubble)