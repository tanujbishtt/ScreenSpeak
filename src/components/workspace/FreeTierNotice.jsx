import { Coffee } from "lucide-react"

export default function FreeTierNotice({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-[min(26rem,100%)] rounded-2xl border-2 border-ink bg-cream-surface p-5 shadow-brutal-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-brut-yellow text-ink">
            <Coffee size={16} />
          </div>
          <h3 className="font-display text-sm font-semibold text-ink">Heads up, quick note</h3>
        </div>

        <p className="text-sm text-ink-muted mb-2">
          SceneSpeak runs on a free-tier API key by default, paid for out of
          my own pocket as a personal project — so replies can sometimes
          take a bit longer than a big commercial app.
        </p>
        <p className="text-sm text-ink-muted mb-4">
          If it feels slow, thanks for your patience 🙏 — and if you'd like
          faster, unlimited responses, you can pop in your own free Gemini
          or OpenAI key from the API key menu above.
        </p>

        <button
          onClick={onDismiss}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-ink font-display text-sm font-semibold text-cream py-2 shadow-brutal-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          Got it, let's go
        </button>
      </div>
    </div>
  )
}
