import { useState } from "react"

const STORAGE_KEY = "scenespeak_tone"

// "roast" (default, matches the app's existing personality) | "encourage"
// Per-device preference, not account data — plain localStorage is enough.
export function useTonePreference() {
  const [tone, setToneState] = useState(() => localStorage.getItem(STORAGE_KEY) || "roast")

  function setTone(next) {
    localStorage.setItem(STORAGE_KEY, next)
    setToneState(next)
  }

  return { tone, setTone }
}