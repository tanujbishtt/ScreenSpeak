import { useState } from "react"
import { achievements } from "../data/achievements"

const STORAGE_KEY = "scenespeak_achievements"

// Same localStorage-first-then-Firebase-later shape as useSessions.js.
// All the stats needed to evaluate EVERY achievement's `check()` live here.
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

function readStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS
  } catch {
    return DEFAULT_STATS
  }
}

function writeStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export function useAchievements() {
  const [stats, setStats] = useState(readStats)
  // Achievements unlocked THIS session that haven't been shown/dismissed
  // yet — this is what drives the toast popup, separate from `stats`
  // (which persists forever) so a toast doesn't reappear on reload.
  const [newlyUnlocked, setNewlyUnlocked] = useState([])

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

      writeStats(withUnlocks)
      return withUnlocks
    })
  }

  // Call ONLY for the scored first-attempt reply (never for regenerates —
  // regenerating shouldn't let someone farm the streak).
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