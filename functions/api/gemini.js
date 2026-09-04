// Cloudflare Pages Function — runs on Cloudflare's server, not in the browser.
// Route: POST /api/gemini
//
// Why this file exists: the browser used to call Google's API directly with
// whatever key the user typed in. That's fine for a user's OWN key, but we
// never want OUR default key(s) visible in browser devtools/network tab —
// so any request that should use a default key MUST go through a server.
// This function is that server.
//
// Set GEMINI_API_KEYS in Cloudflare Pages → Settings → Environment variables
// (as a "Secret", not plain text) — comma-separated if you have more than
// one, e.g. "AIzaSy_first,AIzaSy_second". Do NOT prefix it with VITE_ — that
// prefix tells Vite to bake a variable into the public browser bundle at
// build time, which is the opposite of what we want for a secret key. This
// function reads straight from Cloudflare's server-side env, so no prefix
// is needed (or wanted).

const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse`

// Statuses worth trying the next key for: 401/403 = bad key, 400 = Gemini's
// "API key not valid" is often a 400, 429 = this key is out of quota.
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
  const defaultKeys = parseKeys(env.GEMINI_API_KEYS)
  const body = await request.text()

  async function callGemini(key) {
    return fetch(GEMINI_URL(key), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body,
    })
  }

  // Try the user's key first (if they gave one), then our own keys in
  // order, moving to the next only when the previous one looks bad/
  // exhausted rather than on every kind of error.
  const candidates = userKey ? [userKey, ...defaultKeys] : defaultKeys

  if (candidates.length === 0) {
    return new Response(
      JSON.stringify({ error: { message: "No Gemini API key configured on the server." } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }

  let response = null
  let usedFallback = false

  for (let i = 0; i < candidates.length; i++) {
    response = await callGemini(candidates[i])
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
