import { askGemini } from "./providers/gemini"
import { askOpenAI } from "./providers/openai"
import { askSarvam } from "./providers/sarvam"

const providers = { gemini: askGemini, openai: askOpenAI, sarvam: askSarvam }

export async function askAI(provider, params) {
  const fn = providers[provider]
  if (!fn) throw new Error(`Unknown provider: ${provider}`)
  return fn(params)
}