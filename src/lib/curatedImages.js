import { collection, doc, getDoc, getCountFromServer } from "firebase/firestore"
import { db } from "./firebase"

// Instead of downloading the whole "images" collection, we ask Firestore
// for a cheap document count once (cached), then fetch a SINGLE random doc
// by id per image shown. Assumes doc ids are a contiguous 1..count sequence
// (true as long as images are only ever appended, never deleted from the
// middle of the range).
let cachedCountPromise = null

async function fetchCount() {
  const snapshot = await getCountFromServer(collection(db, "images"))
  return snapshot.data().count
}

function getCount() {
  if (!cachedCountPromise) {
    cachedCountPromise = fetchCount()
  }
  return cachedCountPromise
}

export async function getRandomCuratedImage() {
  const count = await getCount()
  const randomId = Math.floor(Math.random() * count) + 1 // 1..count inclusive
  const snap = await getDoc(doc(db, "images", String(randomId)))
  return snap.data()
}