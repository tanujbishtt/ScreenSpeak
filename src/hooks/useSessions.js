import { useEffect, useState } from "react"
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "./useAuth"

const STORAGE_KEY = "scenespeak_sessions"

// ---- Guest path: localStorage, unchanged from before ----
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocal(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState(user ? [] : readLocal)

  // Guest: keep the cross-tab sync behavior localStorage always had.
  useEffect(() => {
    if (user) return
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) setSessions(readLocal())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [user])

  // Logged in: live-subscribe to Firestore, newest first. Also what
  // picks up sessions as migrateLocalSessionsIfNeeded writes them in.
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "users", user.uid, "sessions"), orderBy("savedAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [user])

  // Sign-out mid-session: switch back to local data immediately instead
  // of showing a stale Firestore list.
  useEffect(() => {
    if (!user) setSessions(readLocal())
  }, [user])

  // If `id` matches an existing session, that entry is updated in place
  // (same id, new content, fresh savedAt). If `id` is null/unmatched, a
  // brand-new session is created instead. Returns synchronously either
  // way — the actual Firestore write happens in the background so
  // WorkspacePage.jsx doesn't need to change to handle a promise.
  function upsertSession({ id, name, image, messages }) {
    const savedId = id ?? `session-${Date.now()}`
    const saved = { id: savedId, name, image, messages, savedAt: Date.now() }

    if (user) {
      setSessions((prev) => {
        const exists = prev.some((s) => s.id === savedId)
        return exists ? prev.map((s) => (s.id === savedId ? saved : s)) : [saved, ...prev]
      })
      setDoc(doc(db, "users", user.uid, "sessions", savedId), {
        name,
        image,
        messages,
        savedAt: saved.savedAt,
      }).catch((err) => console.error("Failed to save session:", err))
      return saved
    }

    const existingIndex = id ? sessions.findIndex((s) => s.id === id) : -1
    const next =
      existingIndex !== -1
        ? sessions.map((s, i) => (i === existingIndex ? saved : s))
        : [saved, ...sessions]
    writeLocal(next)
    setSessions(next)
    return saved
  }

  function deleteSession(id) {
    if (user) {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      deleteDoc(doc(db, "users", user.uid, "sessions", id)).catch((err) =>
        console.error("Failed to delete session:", err),
      )
      return
    }

    const next = sessions.filter((s) => s.id !== id)
    writeLocal(next)
    setSessions(next)
  }

  return { sessions, upsertSession, deleteSession }
}