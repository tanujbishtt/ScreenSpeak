import { useState, useRef, useEffect } from "react"
import { KeyRound, ExternalLink, Check } from "lucide-react"
import { useAiSettings } from "../../hooks/useAiSettings"

const PROVIDERS = [
  { id: "gemini", label: "Gemini", keyHint: "AIzaSy...", keyUrl: "https://aistudio.google.com/apikey" },
  { id: "openai", label: "ChatGPT", keyHint: "sk-...", keyUrl: "https://platform.openai.com/api-keys" },
  { id: "claude", label: "Claude", keyHint: "sk-ant-...", keyUrl: "https://console.anthropic.com/settings/keys" },
]

export default function ApiKeyDropdown() {
  const { provider, keys, setProvider, setKey, hasKey } = useAiSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(provider)
  const [draft, setDraft] = useState(keys[provider])
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setDraft(keys[activeTab])
  }, [activeTab, keys])

  function handleSave() {
    setKey(activeTab, draft.trim())
    setProvider(activeTab)
    setIsOpen(false)
  }

  const current = PROVIDERS.find((p) => p.id === activeTab)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border-2 border-ink px-3 py-1.5 font-display text-sm font-medium shadow-brutal-sm transition-all hover:-translate-y-0.5 ${
          hasKey
            ? "bg-cream-surface text-ink"
            : "bg-brut-yellow text-ink"
        }`}
      >
        {hasKey ? (
          <>
            <span className="hidden sm:inline">SceneSpeak · </span>
            {PROVIDERS.find((p) => p.id === provider)?.label}
          </>
        ) : (
          "Add API Key"
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-[calc(100%+8px)] z-100 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-ink bg-cream-surface p-4 shadow-brutal-lg">
          <div className="flex gap-1 mb-3 rounded-lg border-2 border-ink bg-cream p-1">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex-1 rounded-md py-1.5 font-display text-xs font-medium transition ${
                  activeTab === p.id
                    ? "bg-ink text-cream"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {p.label}
                {keys[p.id] && <Check size={11} className="inline ml-1 -mt-0.5" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <KeyRound size={15} className="text-ink-muted" />
            <h4 className="font-display text-sm font-semibold text-ink">
              {current.label} API Key
            </h4>
          </div>
          <p className="text-xs text-ink-muted mb-3">
            Stored only in your browser. Never sent anywhere except directly to {current.label}.
          </p>

          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={current.keyHint}
            className="w-full rounded-lg border-2 border-ink bg-cream px-3 py-2 text-sm text-ink outline-none focus:shadow-brutal-sm mb-3"
          />

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-ink font-display text-sm font-semibold text-cream py-2 shadow-brutal-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            Save & Use {current.label}
          </button>

          <a
            href={current.keyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1 text-xs text-ink-muted hover:text-ink transition"
          >
            Get a {current.label} key
            <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  )
}