import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

// Uploads a user's picked file to Firebase Storage and returns its public
// download URL. Path is scoped per-user (uploads/{uid}/...) so Storage
// rules can lock down who's allowed to read/write what.
export async function uploadImageToStorage(uid, uploadId, file) {
  const path = `uploads/${uid}/${uploadId}-${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}