import { imageUrlToBase64 } from "../imageToBase64"
import { getSystemInstruction, SCORE_INSTRUCTION } from "../systemPrompt"
import { extractScore } from "../extractScore"
import { readSSE } from "../sse"

const MODEL = "claude-sonnet-5"

export async function askClaude({ apiKey, imageUrl, history, requestScore, tone, onDelta }) {
  if (!apiKey) throw new Error("No Claude API key set")

  const { base64, mimeType } = await imageUrlToBase64(imageUrl)

  const systemText = getSystemInstruction(tone) + (requestScore ? SCORE_INSTRUCTION : "")

  const messages = history.map((turn, i) => {
    const content = [{ type: "text", text: turn.content }]
    if (i === 0) {
      content.unshift({
        type: "image",
        source: { type: "base64", media_type: mimeType, data: base64 },
      })
    }
    return { role: turn.role === "assistant" ? "assistant" : "user", content }
  })

  const response = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, system: systemText, max_tokens: 1024, messages, stream: true }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `Claude request failed (${response.status})`)
  }

  let fullText = ""
  for await (const chunk of readSSE(response)) {
    if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
      fullText += chunk.delta.text
      onDelta?.(chunk.delta.text)
    }
  }

  if (!fullText) throw new Error("Claude returned an empty response")
  return extractScore(fullText)
}