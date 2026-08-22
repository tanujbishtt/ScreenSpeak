import { useState, useRef, useEffect } from "react"
import { KeyRound, ExternalLink, Check } from "lucide-react"
import Logo from "../layout/Logo"
import { useAiSettings } from "../../hooks/useAiSettings"

const PROVIDERS = [
  { id: "gemini", label: "Gemini", keyHint: "AIzaSy...", keyUrl: "https://aistudio.google.com/apikey" },
  { id: "openai", label: "ChatGPT", keyHint: "sk-...", keyUrl: "https://platform.openai.com/api-keys" },
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
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
          hasKey
            ? "border-border bg-surface/60 text-slate-700 dark:text-slate-200"
            : "border-amber-400/40 bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400"
        }`}
      >
        <Logo size={16} />
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
        <div className="absolute left-1/2 top-[calc(100%+8px)] z-100 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
          <div className="flex gap-1 mb-3 rounded-lg bg-canvas p-1">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                  activeTab === p.id
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {p.label}
                {keys[p.id] && <Check size={11} className="inline ml-1 -mt-0.5" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <KeyRound size={15} className="text-slate-500 dark:text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
              {current.label} API Key
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Stored only in your browser. Never sent anywhere except directly to {current.label}.
          </p>

          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={current.keyHint}
            className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary mb-3"
          />

          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2 hover:opacity-90 transition"
          >
            Save & Use {current.label}
          </button>

          <a
            href={current.keyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition"
          >
            Get a {current.label} key
            <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  )
}