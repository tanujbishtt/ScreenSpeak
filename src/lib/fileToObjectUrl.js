// A "blob URL" is a temporary in-browser URL that points directly to a File
// the user picked from their device (no upload to any server happens here).
// It works with fetch() exactly like a normal https:// URL, which is why our
// existing gemini.js provider (imageUrlToBase64) can use it without changes.

export function fileToObjectUrl(file) {
  return URL.createObjectURL(file)
}

// Blob URLs stay in browser memory until the page reloads UNLESS we free
// them manually. Call this whenever we replace/discard an uploaded image.
export function revokeObjectUrl(url) {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url)
}