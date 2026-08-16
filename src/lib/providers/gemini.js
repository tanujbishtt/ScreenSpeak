import { imageUrlToBase64 } from "../imageToBase64"
import { SYSTEM_INSTRUCTION } from "../systemPrompt"

const MODEL = "gemini-3.6-flash"

export async function askGemini({ apiKey, imageUrl, history }) {
  if (!apiKey) throw new Error("No Gemini API key set")

  const { base64, mimeType } = await imageUrlToBase64(imageUrl)

  const contents = history.map((turn, i) => {
    const parts = [{ text: turn.content }]
    if (i === 0) parts.push({ inlineData: { mimeType, data: base64 } })
    return { role: turn.role === "assistant" ? "model" : "user", parts }
  })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `Gemini request failed (${response.status})`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini returned an empty response")
  return text
}