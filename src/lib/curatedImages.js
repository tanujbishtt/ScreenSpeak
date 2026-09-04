import { collection, doc, getDoc, getCountFromServer } from "firebase/firestore"
import { db } from "./firebase"

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