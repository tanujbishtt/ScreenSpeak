import { imageUrlToBase64 } from "../imageToBase64"
import { getSystemInstruction, SCORE_INSTRUCTION } from "../systemPrompt"
import { extractScore } from "../extractScore"
import { readSSE } from "../sse"

const MODEL = "gemini-3.6-flash"

// onDelta(deltaText) fires for each new chunk of text as it streams in,
// so the caller can grow the chat bubble live. Final return value is
// still { text, score, corrected } exactly like before.
export async function askGemini({ apiKey, imageUrl, history, requestScore, tone, onDelta }) {
  if (!apiKey) throw new Error("No Gemini API key set")

  const { base64, mimeType } = await imageUrlToBase64(imageUrl)

  const contents = history.map((turn, i) => {
    const parts = [{ text: turn.content }]
    if (i === 0) parts.push({ inlineData: { mimeType, data: base64 } })
    return { role: turn.role === "assistant" ? "model" : "user", parts }
  })

  const systemText = getSystemInstruction(tone) + (requestScore ? SCORE_INSTRUCTION : "")

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents,
      }),
    }
  )

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