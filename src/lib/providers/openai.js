import { imageUrlToBase64 } from "../imageToBase64"
import { getSystemInstruction, SCORE_INSTRUCTION } from "../systemPrompt"
import { extractScore } from "../extractScore"
import { readSSE } from "../sse"

const MODEL = "gpt-5.6"

// apiKey is now OPTIONAL — see the note in providers/gemini.js. Same
// fallback-to-default-key behavior, handled by functions/api/openai.js.
export async function askOpenAI({ apiKey, imageUrl, history, requestScore, tone, onDelta }) {
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

  const headers = { "Content-Type": "application/json" }
  if (apiKey) headers["x-user-key"] = apiKey

  const response = await fetch("/api/openai", {
    method: "POST",
    headers,
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `OpenAI request failed (${response.status})`)
  }

  let fullText = ""
  for await (const chunk of readSSE(response)) {
    const delta = chunk.choices?.[0]?.delta?.content
    if (delta) {
      fullText += delta
      onDelta?.(delta)
    }
  }

  if (!fullText) throw new Error("OpenAI returned an empty response")
  return extractScore(fullText)
}
