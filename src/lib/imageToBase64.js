const cache = new Map()

export async function imageUrlToBase64(url) {
  if (cache.has(url)) return cache.get(url)

  const response = await fetch(url)
  const blob = await response.blob()

  const result = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1]
      resolve({ base64, mimeType: blob.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

  cache.set(url, result)
  return result
}
