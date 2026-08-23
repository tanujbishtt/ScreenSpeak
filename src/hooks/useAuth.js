import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"
import { ensureUserProfile } from "../lib/userProfile"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Fires once on mount with the cached session (if any), then again on
    // every sign-in/sign-out. This is the single source of truth for
    // "is anyone logged in" across the whole app.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
      if (firebaseUser) await ensureUserProfile(firebaseUser)
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