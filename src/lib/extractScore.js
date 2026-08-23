// Looks for a "SCORE: <number>" line at the very end of the AI's reply
// (see SCORE_INSTRUCTION in systemPrompt.js) and splits it out.
// Returns { text, score } — score is null when no such line is found,
// which naturally covers every follow-up/non-scored call.
export function extractScore(rawText) {
  const match = rawText.match(/\n?SCORE:\s*(\d{1,3})\s*$/i)

  if (!match) {
    return { text: rawText.trim(), score: null }
  }

  const score = Math.max(0, Math.min(100, parseInt(match[1], 10)))
  const text = rawText.slice(0, match.index).trim()
  return { text, score }
}