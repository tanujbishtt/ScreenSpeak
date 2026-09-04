import { useState } from "react"

const STORAGE_KEY = "scenespeak_tone"

// Per-device preference, not account data — plain localStorage is enough.
export function useTonePreference() {
  const [tone, setToneState] = useState(() => localStorage.getItem(STORAGE_KEY) || "encourage")

  function setTone(next) {
    localStorage.setItem(STORAGE_KEY, next)
    setToneState(next)
  }

  return { tone, setTone }
}