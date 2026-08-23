import { useEffect, useState } from "react"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import { achievements } from "../data/achievements"
import { useAuth } from "./useAuth"

const STORAGE_KEY = "scenespeak_achievements"

const DEFAULT_STATS = {
  totalDescribed: 0,
  currentStreak: 0,     // consecutive first-attempts scored 70+
  bestStreak: 0,
  currentLossStreak: 0, // consecutive first-attempts scored below 50
  bestLossStreak: 0,
  referenceTabViews: 0, // Native/Gen-Z tab opened count
  bestScore: 0,
  unlockedIds: [],
}

// ---- Guest path: localStorage, unchanged from before ----
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS
  } catch {
    return DEFAULT_STATS
  }
}

function writeLocal(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useAchievements() {
  const { user } = useAuth()
  const [stats, setStats] = useState(user ? DEFAULT_STATS : readLocal)
  // Achievements unlocked THIS session that haven't been shown/dismissed
  // yet — drives the toast popup, separate from `stats` so a toast
  // doesn't reappear on reload.
  const [newlyUnlocked, setNewlyUnlocked] = useState([])

  // Logged in: live-subscribe to the stats fields on the user doc — also
  // what picks up the migrated values right after first login.
  useEffect(() => {
    if (!user) return
    const ref = doc(db, "users", user.uid)
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.data()
      if (!data) return
      setStats({
        totalDescribed: data.totalDescribed ?? 0,
        currentStreak: data.currentStreak ?? 0,
        bestStreak: data.bestStreak ?? 0,
        currentLossStreak: data.currentLossStreak ?? 0,
        bestLossStreak: data.bestLossStreak ?? 0,
        referenceTabViews: data.referenceTabViews ?? 0,
        bestScore: data.bestScore ?? 0,
        unlockedIds: data.unlockedIds ?? [],
      })
    })
    return unsubscribe
  }, [user])

  // Sign-out mid-session: switch back to local stats immediately.
  useEffect(() => {
    if (!user) setStats(readLocal())
  }, [user])

  function applyUpdate(updater) {
    setStats((prev) => {
      const next = updater(prev)

      const justUnlocked = achievements.filter(
        (a) => !prev.unlockedIds.includes(a.id) && a.check(next),
      )

      const withUnlocks =
        justUnlocked.length > 0
          ? { ...next, unlockedIds: [...next.unlockedIds, ...justUnlocked.map((a) => a.id)] }
          : next

      if (justUnlocked.length > 0) {
        setNewlyUnlocked((prevToasts) => [...prevToasts, ...justUnlocked])
      }

      if (user) {
        setDoc(doc(db, "users", user.uid), withUnlocks, { merge: true }).catch((err) =>
          console.error("Failed to save achievement stats:", err),
        )
      } else {
        writeLocal(withUnlocks)
      }

      return withUnlocks
    })
  }

  // Call ONLY for the scored first-attempt reply (never regenerates).
  function recordScore(score) {
    applyUpdate((prev) => {
      const isGood = score >= 70
      const isBad = score < 50
      const currentStreak = isGood ? prev.currentStreak + 1 : 0
      const currentLossStreak = isBad ? prev.currentLossStreak + 1 : 0
      return {
        ...prev,
        totalDescribed: prev.totalDescribed + 1,
        currentStreak,
        bestStreak: Math.max(prev.bestStreak, currentStreak),
        currentLossStreak,
        bestLossStreak: Math.max(prev.bestLossStreak, currentLossStreak),
        bestScore: Math.max(prev.bestScore, score),
      }
    })
  }

  // Call whenever the Native/Gen-Z reference tab gets opened.
  function recordReferenceView() {
    applyUpdate((prev) => ({ ...prev, referenceTabViews: prev.referenceTabViews + 1 }))
  }

  function dismissUnlock(id) {
    setNewlyUnlocked((prev) => prev.filter((a) => a.id !== id))
  }

  const unlockedSet = new Set(stats.unlockedIds)
  const withStatus = achievements.map((a) => ({ ...a, unlocked: unlockedSet.has(a.id) }))

  return {
    stats,
    achievements: withStatus,
    newlyUnlocked,
    recordScore,
    recordReferenceView,
    dismissUnlock,
  }
}