import { createContext, useContext, useState, useEffect } from "react"

const AiSettingsContext = createContext()

const STORAGE_KEY = "scenespeak_ai_settings"
const defaultSettings = {
  provider: "gemini",
  keys: { gemini: "", openai: "", claude: "" },
}

export function AiSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultSettings
    try {
      const parsed = JSON.parse(saved)
      // Merge keys specifically (not just top-level spread) so someone
      // who saved settings BEFORE "claude" existed still gets
      // keys.claude === "" instead of undefined (which would crash the
      // dropdown's input value).
      return { ...defaultSettings, ...parsed, keys: { ...defaultSettings.keys, ...parsed.keys } }
    } catch {
      return defaultSettings
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  function setProvider(provider) {
    setSettings((prev) => ({ ...prev, provider }))
  }

  function setKey(provider, key) {
    setSettings((prev) => ({ ...prev, keys: { ...prev.keys, [provider]: key } }))
  }

  const value = {
    provider: settings.provider,
    apiKey: settings.keys[settings.provider],
    keys: settings.keys,
    setProvider,
    setKey,
    hasKey: Boolean(settings.keys[settings.provider]),
  }

  return <AiSettingsContext.Provider value={value}>{children}</AiSettingsContext.Provider>
}

export function useAiSettings() {
  const ctx = useContext(AiSettingsContext)
  if (!ctx) throw new Error("useAiSettings must be used inside <AiSettingsProvider>")
  return ctx
}