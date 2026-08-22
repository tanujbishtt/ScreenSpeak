import { RotateCcw, Sparkles } from "lucide-react"
import Logo from "../layout/Logo"

export default function ChatBubble({ message, onRegenerate, isRegenerating }) {
  const { role, content, isTemplate, displayLabel, canRegenerate } = message

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
            bg-gradient-to-br from-primary to-primary/85
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
    <div className="flex animate-message-in justify-start gap-2.5">
      <div className="mt-1 shrink-0">
        <Logo size={36} />
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
        {content}
        {canRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="
              -ml-2 mt-2.5 flex items-center gap-1.5 rounded-full
              px-2 py-1 text-xs text-slate-500 transition
              hover:bg-surface-muted hover:text-slate-800
              disabled:opacity-50
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