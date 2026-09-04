// Cloudflare Pages Function — runs on Cloudflare's server, not in the browser.
// Route: POST /api/openai
// See functions/api/gemini.js for the full explanation of why this exists
// and why the env var must NOT be prefixed with VITE_.
//
// Set OPENAI_API_KEYS in Cloudflare Pages → Settings → Environment variables
// (as a "Secret") — comma-separated if you have more than one,
// e.g. "sk-first,sk-second".

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"

// 401 = bad key, 429 = this key is out of quota/rate-limited.
const RETRYABLE_STATUSES = new Set([400, 401, 403, 429])

function parseKeys(raw) {
  return (raw || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
}

export async function onRequestPost(context) {
  const { request, env } = context

  const userKey = (request.headers.get("x-user-key") || "").trim()
  const defaultKeys = parseKeys(env.OPENAI_API_KEYS)
  const body = await request.text()

  async function callOpenAI(key) {
    return fetch(OPENAI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body,
    })
  }

  const candidates = userKey ? [userKey, ...defaultKeys] : defaultKeys

  if (candidates.length === 0) {
    return new Response(
      JSON.stringify({ error: { message: "No OpenAI API key configured on the server." } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  let response = null
  let usedFallback = false

  for (let i = 0; i < candidates.length; i++) {
    response = await callOpenAI(candidates[i])
    if (response.ok) {
      usedFallback = candidates[i] !== userKey
      break
    }
    const isLast = i === candidates.length - 1
    if (isLast || !RETRYABLE_STATUSES.has(response.status)) break
    response.body?.cancel()
  }

  const headers = new Headers(response.headers)
  headers.set("x-used-fallback-key", String(usedFallback))
  return new Response(response.body, { status: response.status, headers })
}
