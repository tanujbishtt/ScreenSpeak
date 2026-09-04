// Cloudflare Pages Function — runs on Cloudflare's server, not in the browser.
// Route: POST /api/claude
//
// Note: the old code called "/api/claude/v1/messages" and relied on the
// Vite dev-server proxy in vite.config.js — that proxy only exists on your
// laptop. On the real deployed site there was no server behind that path,
// so Claude never actually worked in production. This function fixes that.
//
// You haven't given ANTHROPIC_API_KEYS as a default, so this stays
// BYOK-only (a visitor MUST supply their own Claude key) — unless you add
// ANTHROPIC_API_KEYS (comma-separated) as an env var later, in which case
// it behaves just like gemini.js/openai.js and falls back automatically.

const CLAUDE_URL = "https://api.anthropic.com/v1/messages"

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
  const defaultKeys = parseKeys(env.ANTHROPIC_API_KEYS)
  const body = await request.text()

  async function callClaude(key) {
    return fetch(CLAUDE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body,
    })
  }

  const candidates = userKey ? [userKey, ...defaultKeys] : defaultKeys

  if (candidates.length === 0) {
    return new Response(
      JSON.stringify({ error: { message: "No Claude API key set. Add your own key to use Claude." } }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    )
  }

  let response = null
  let usedFallback = false

  for (let i = 0; i < candidates.length; i++) {
    response = await callClaude(candidates[i])
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
