import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

// Runs every time someone signs in. Creates the users/{uid} doc ONLY if
// it doesn't already exist — re-logins never overwrite anything.
// Sessions/achievements cloud sync get added to this same file in the
// next two migration steps — this is just identity for now.
export async function ensureUserProfile(firebaseUser) {
  const ref = doc(db, "users", firebaseUser.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()

  const profile = {
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, profile)
  return profile
}