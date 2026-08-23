import { doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

const LOCAL_KEY = "scenespeak_sessions"

// Runs once per account, right after ensureUserProfile. Copies whatever
// sat in localStorage sessions into Firestore, then clears localStorage
// so a later sign-out doesn't bring back stale/duplicate-looking data.
//
// NOTE: if a copied session's image is an uploaded photo (blob URL), that
// URL is already dead by the time this runs (blob URLs die on reload) —
// the session carries over but the image itself is broken until the
// Uploads/Storage step (last one in our plan) actually persists the file.
export async function migrateLocalSessionsIfNeeded(uid, profile) {
  if (profile.migratedSessions) return

  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    const localSessions = raw ? JSON.parse(raw) : []

    for (const session of localSessions) {
      const ref = doc(db, "users", uid, "sessions", session.id)
      await setDoc(ref, {
        name: session.name,
        image: session.image,
        messages: session.messages,
        savedAt: session.savedAt,
      })
    }

    localStorage.removeItem(LOCAL_KEY)
  } catch (err) {
    console.error("Session migration failed:", err)
  } finally {
    // Marked done even on partial failure — otherwise every future login
    // would keep retrying and creating duplicate session docs.
    await updateDoc(doc(db, "users", uid), { migratedSessions: true })
  }
}