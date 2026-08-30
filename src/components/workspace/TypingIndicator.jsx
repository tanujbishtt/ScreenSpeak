import Logo from "../layout/Logo"

export default function TypingIndicator() {
  return (
    <div className="flex animate-message-in justify-start gap-2.5">
      <div className="mt-1 shrink-0">
        <Logo size={36} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border-2 border-ink bg-cream-surface px-4 py-3.5 shadow-brutal-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-ink" />
      </div>
    </div>
  )
}