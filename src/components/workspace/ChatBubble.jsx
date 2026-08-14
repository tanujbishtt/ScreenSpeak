import { RotateCcw } from "lucide-react"

export default function ChatBubble({ message, onRegenerate }) {
  const { role, content, isTemplate, canRegenerate } = message

  // A clicked template button (e.g. "Grammar Errors") — small chip, not a full bubble
  if (role === "user" && isTemplate) {
    return (
      <div className="flex justify-end">
        <div className="rounded-full bg-blue-600/10 dark:bg-blue-400/10 border border-blue-600/20 dark:border-blue-400/20 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
          {content}
        </div>
      </div>
    )
  }

  // The user's typed description
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-blue-600 text-white px-4 py-3 text-[15px] leading-6">
          {content}
        </div>
      </div>
    )
  }

  // AI response
  return (
    <div className="flex justify-start">
      <div className="max-w-[75%] rounded-2xl rounded-bl-md border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-4 py-3 text-[15px] leading-6 text-slate-800 dark:text-slate-200">
        {content}

        {canRegenerate && (
          <button
            onClick={onRegenerate}
            className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
          >
            <RotateCcw size={12} />
            Try another
          </button>
        )}
      </div>
    </div>
  )
}