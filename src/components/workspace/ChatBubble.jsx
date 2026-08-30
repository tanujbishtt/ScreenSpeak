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
        <div className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
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
            bg-linear-to-br from-primary to-primary/85
            px-4 py-3
            text-[15px] leading-6
            text-primary-foreground
            shadow-sm
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
        <Logo size={46} className="text-gray-950 dark:text-white" />
      </div>

      <div
        className="
          max-w-[80%]
          rounded-2xl rounded-bl-md
          border border-primary/15
          bg-white/70
          px-4 py-3
          text-[15px] leading-6
          text-slate-800
          shadow-sm
          backdrop-blur-xl
          dark:border-white/10
          dark:bg-white/5
          dark:text-slate-200
        "
      >
        {typeof score === "number" && (
          <div className="mb-2.5 border-b border-black/5 pb-2.5 dark:border-white/10">
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
              px-2 py-1 text-xs text-slate-500 transition-all
              hover:bg-surface-muted hover:text-slate-800
              active:scale-90 disabled:opacity-50
              dark:text-slate-400 dark:hover:bg-white/5
              dark:hover:text-primary-foreground
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