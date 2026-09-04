import { imageUrlToBase64 } from "../imageToBase64"
import { getSystemInstruction, SCORE_INSTRUCTION } from "../systemPrompt"
import { extractScore } from "../extractScore"
import { readSSE } from "../sse"

// onDelta(deltaText) fires for each new chunk of text as it streams in,
// so the caller can grow the chat bubble live. Final return value is
// still { text, score, corrected } exactly like before.
//
// apiKey is now OPTIONAL: if the user hasn't set one (or theirs turns out
// to be invalid), our own /api/gemini function falls back to the site's
// default key. See functions/api/gemini.js.
export async function askGemini({ apiKey, imageUrl, history, requestScore, tone, onDelta }) {
  const { base64, mimeType } = await imageUrlToBase64(imageUrl)

  const contents = history.map((turn, i) => {
    const parts = [{ text: turn.content }]
    if (i === 0) parts.push({ inlineData: { mimeType, data: base64 } })
    return { role: turn.role === "assistant" ? "model" : "user", parts }
  })

  const systemText = getSystemInstruction(tone) + (requestScore ? SCORE_INSTRUCTION : "")

  const headers = { "Content-Type": "application/json" }
  if (apiKey) headers["x-user-key"] = apiKey

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `Gemini request failed (${response.status})`)
  }

  let fullText = ""
  for await (const chunk of readSSE(response)) {
    const delta = chunk.candidates?.[0]?.content?.parts?.[0]?.text
    if (delta) {
      fullText += delta
      onDelta?.(delta)
    }
  }

  if (!fullText) throw new Error("Gemini returned an empty response")
  return extractScore(fullText)
}
