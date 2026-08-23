import { useState, useEffect } from "react"

const STORAGE_KEY = "scenespeak_ai_settings"
const defaultSettings = {
  provider: "gemini",
  keys: { gemini: "", openai: "" },
}

export function useAiSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultSettings
    try {
      return { ...defaultSettings, ...JSON.parse(saved) }
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

  return {
    provider: settings.provider,
    apiKey: settings.keys[settings.provider],
    keys: settings.keys,
    setProvider,
    setKey,
    hasKey: Boolean(settings.keys[settings.provider]),
  }
}