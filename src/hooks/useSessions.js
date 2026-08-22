import { useEffect, useState } from "react"

const STORAGE_KEY = "scenespeak_sessions"

// TEMP: localStorage-backed. Written the way it'll need to work once
// swapped for Firestore (async-shaped returns, no localStorage access
// outside this file) — migration later only touches THIS file.

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function useSessions() {
  const [sessions, setSessions] = useState(readAll)

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) setSessions(readAll())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // If `id` matches an existing session, that entry is updated in place
  // (same id, new content, fresh savedAt) — no duplicate gets created.
  // If `id` is null/unmatched, a brand-new session is created instead.
  function upsertSession({ id, name, image, messages }) {
    const existingIndex = id ? sessions.findIndex((s) => s.id === id) : -1

    const saved =
      existingIndex !== -1
        ? { ...sessions[existingIndex], name, image, messages, savedAt: Date.now() }
        : { id: `session-${Date.now()}`, name, image, messages, savedAt: Date.now() }

    const next =
      existingIndex !== -1
        ? sessions.map((s, i) => (i === existingIndex ? saved : s))
        : [saved, ...sessions]

    writeAll(next)
    setSessions(next)
    return saved
  }

  function deleteSession(id) {
    const next = sessions.filter((s) => s.id !== id)
    writeAll(next)
    setSessions(next)
  }

  return { sessions, upsertSession, deleteSession }
}