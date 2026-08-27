// Reads a fetch Response whose body is a Server-Sent-Events stream and
// yields each event's `data: ...` payload, already JSON.parsed, one at a
// time as it arrives. Gemini, OpenAI, and Claude all use this same SSE
// envelope for streaming (just different JSON shapes inside), so this one
// generator is shared by all three providers instead of writing the same
// byte-reading/line-buffering logic three times.
export async function* readSSE(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Split on newlines, but the LAST piece might be a half-arrived line
    // (the network chunk could cut a line in the middle) — keep that
    // piece in the buffer and prepend it to the next read instead of
    // parsing it too early.
    const lines = buffer.split("\n")
    buffer = lines.pop()

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith("data:")) continue
      const payload = trimmed.slice(5).trim()
      if (payload === "[DONE]") return
      try {
        yield JSON.parse(payload)
      } catch {
        // Malformed/partial JSON on a line — skip it, next chunks continue fine.
      }
    }
  }
}