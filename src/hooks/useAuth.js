import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"
import { ensureUserProfile } from "../lib/userProfile"
import { migrateLocalSessionsIfNeeded } from "../lib/migrateSessions"
import { migrateLocalAchievementsIfNeeded } from "../lib/migrateAchievements"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Fires once on mount with the cached session (if any), then again on
    // every sign-in/sign-out. Single source of truth for "who's logged in"
    // across the whole app.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)

      if (firebaseUser) {
        const profile = await ensureUserProfile(firebaseUser)
        await migrateLocalSessionsIfNeeded(firebaseUser.uid, profile)
        await migrateLocalAchievementsIfNeeded(firebaseUser.uid, profile)
      }
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function signOutUser() {
    await signOut(auth)
  }

  return { user, authLoading, signInWithGoogle, signOutUser }
}