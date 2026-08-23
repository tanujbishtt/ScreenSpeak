// Looks for the "CORRECTED: ..." + "SCORE: <number>" pair of trailing
// lines (see SCORE_INSTRUCTION in systemPrompt.js) and splits both out.
// Returns { text, score, corrected } — score/corrected are null when no
// such lines are found, which naturally covers every non-scored call.
export function extractScore(rawText) {
  const bothMatch = rawText.match(/\n?CORRECTED:\s*(.+?)\s*\n?SCORE:\s*(\d{1,3})\s*$/i)

  if (bothMatch) {
    const corrected = bothMatch[1].trim()
    const score = Math.max(0, Math.min(100, parseInt(bothMatch[2], 10)))
    const text = rawText.slice(0, bothMatch.index).trim()
    return { text, score, corrected }
  }

  // Fallback: model obeyed the SCORE line but dropped CORRECTED somehow.
  const scoreOnlyMatch = rawText.match(/\n?SCORE:\s*(\d{1,3})\s*$/i)
  if (scoreOnlyMatch) {
    const score = Math.max(0, Math.min(100, parseInt(scoreOnlyMatch[1], 10)))
    const text = rawText.slice(0, scoreOnlyMatch.index).trim()
    return { text, score, corrected: null }
  }

  return { text: rawText.trim(), score: null, corrected: null }
}