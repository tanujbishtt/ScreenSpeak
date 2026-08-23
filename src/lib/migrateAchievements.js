import { doc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

const LOCAL_KEY = "scenespeak_achievements"

// Runs once per account, right after ensureUserProfile (and after session
// migration). Copies localStorage achievement stats into the user doc's
// fields, then clears localStorage.
export async function migrateLocalAchievementsIfNeeded(uid, profile) {
  if (profile.migratedAchievements) return

  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const local = JSON.parse(raw)
      await updateDoc(doc(db, "users", uid), {
        totalDescribed: local.totalDescribed ?? 0,
        currentStreak: local.currentStreak ?? 0,
        bestStreak: local.bestStreak ?? 0,
        currentLossStreak: local.currentLossStreak ?? 0,
        bestLossStreak: local.bestLossStreak ?? 0,
        referenceTabViews: local.referenceTabViews ?? 0,
        bestScore: local.bestScore ?? 0,
        unlockedIds: local.unlockedIds ?? [],
      })
    }
    localStorage.removeItem(LOCAL_KEY)
  } catch (err) {
    console.error("Achievement migration failed:", err)
  } finally {
    // Marked done even on partial failure — avoids retry-every-login loops.
    await updateDoc(doc(db, "users", uid), { migratedAchievements: true })
  }
}