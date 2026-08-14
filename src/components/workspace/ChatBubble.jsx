import { RotateCcw } from "lucide-react"
import Logo from "../layout/Logo"

export default function ChatBubble({ message, onRegenerate }) {
  const { role, content, isTemplate, canRegenerate } = message

  if (role === "user" && isTemplate) {
    return (
      <div className="flex justify-end">
        <div className="rounded-full bg-blue-600/10 dark:bg-blue-400/10 border border-blue-600/20 dark:border-blue-400/20 px-4 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
          {content}
        </div>
      </div>
    )
  }

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-blue-600 text-white px-4 py-3 text-[15px] leading-6">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-2.5">
      <div className="shrink-0 mt-1">
        <Logo size={40} />
      </div>
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