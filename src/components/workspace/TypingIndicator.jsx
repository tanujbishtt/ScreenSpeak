import Logo from "../layout/Logo"

export default function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2.5">
      <div className="mt-1 shrink-0">
        <Logo size={40} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-4 py-3.5">
        <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
      </div>
    </div>
  )
}