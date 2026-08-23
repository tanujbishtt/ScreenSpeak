// Word-level diff via classic LCS (longest common subsequence). Inputs are
// always a single sentence, so an O(n*m) table is completely fine here.
function tokenize(sentence) {
  return sentence.trim().split(/\s+/).filter(Boolean)
}

// Returns { originalTokens, correctedTokens } — each token is
// { text, type }, type is "same" | "removed" (original only) | "added"
// (corrected only).
export function wordDiff(original, corrected) {
  const a = tokenize(original)
  const b = tokenize(corrected)
  const n = a.length
  const m = b.length

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  const originalTokens = []
  const correctedTokens = []
  let i = n
  let j = m
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      originalTokens.unshift({ text: a[i - 1], type: "same" })
      correctedTokens.unshift({ text: b[j - 1], type: "same" })
      i--; j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      originalTokens.unshift({ text: a[i - 1], type: "removed" })
      i--
    } else {
      correctedTokens.unshift({ text: b[j - 1], type: "added" })
      j--
    }
  }
  while (i > 0) {
    originalTokens.unshift({ text: a[i - 1], type: "removed" })
    i--
  }
  while (j > 0) {
    correctedTokens.unshift({ text: b[j - 1], type: "added" })
    j--
  }

  return { originalTokens, correctedTokens }
}