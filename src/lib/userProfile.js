import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

// Runs every time someone signs in. Creates the users/{uid} doc ONLY if
// it doesn't already exist — re-logins never overwrite anything.
// Achievement stats live as top-level fields on this same doc (one
// object per user, no subcollection needed like sessions has).
export async function ensureUserProfile(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()

  const profile = {
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    createdAt: serverTimestamp(),
    migratedSessions: false,
    migratedAchievements: false,
    totalDescribed: 0,
    currentStreak: 0,
    bestStreak: 0,
    currentLossStreak: 0,
    bestLossStreak: 0,
    referenceTabViews: 0,
    bestScore: 0,
    unlockedIds: [],
  }
  await setDoc(ref, profile)
  return profile
}