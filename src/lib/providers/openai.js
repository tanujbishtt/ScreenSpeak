import { imageUrlToBase64 } from "../imageToBase64"
import { getSystemInstruction, SCORE_INSTRUCTION } from "../systemPrompt"
import { extractScore } from "../extractScore"

const MODEL = "gpt-5.6"

export async function askOpenAI({ apiKey, imageUrl, history, requestScore, tone }) {
  if (!apiKey) throw new Error("No OpenAI API key set")

  const { base64, mimeType } = await imageUrlToBase64(imageUrl)

  const systemText = getSystemInstruction(tone) + (requestScore ? SCORE_INSTRUCTION : "")

  const messages = [
    { role: "system", content: systemText },
    ...history.map((turn, i) => {
      if (i === 0) {
        return {
          role: "user",
          content: [
            { type: "text", text: turn.content },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
          ],
        }
      }
      return { role: turn.role, content: turn.content }
    }),
  ]

  const response = await fetch("/api/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `OpenAI request failed (${response.status})`)
  }

  const data = await response.json()
  const rawText = data.choices?.[0]?.message?.content
  if (!rawText) throw new Error("OpenAI returned an empty response")
  return extractScore(rawText)
}