import { SYSTEM_INSTRUCTION } from "../systemPrompt"

const MODEL = "sarvam-105b"

export async function askSarvam({ apiKey, history }) {
  if (!apiKey) throw new Error("No Sarvam API key set")

  const messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history.map((turn) => ({ role: turn.role, content: turn.content })),
  ]

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `Sarvam request failed (${response.status})`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error("Sarvam returned an empty response")
  return text
}