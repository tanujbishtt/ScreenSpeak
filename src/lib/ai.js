import { askGemini } from "./providers/gemini"
import { askOpenAI } from "./providers/openai"

const providers = { gemini: askGemini, openai: askOpenAI }

export async function askAI(provider, params) {
  const fn = providers[provider]
  if (!fn) throw new Error(`Unknown provider: ${provider}`)
  return fn(params)
}