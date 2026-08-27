import { askGemini } from "./providers/gemini"
import { askOpenAI } from "./providers/openai"
import { askClaude } from "./providers/claude"

const providers = { gemini: askGemini, openai: askOpenAI, claude: askClaude }

export async function askAI(provider, params) {
  const fn = providers[provider]
  if (!fn) throw new Error(`Unknown provider: ${provider}`)
  return fn(params)
}