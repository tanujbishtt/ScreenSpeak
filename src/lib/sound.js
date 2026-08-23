// Tiny synthesized "whoosh" via the Web Audio API — no audio file needed,
// so nothing to bundle or host. Just a quick frequency sweep + fade out.
let audioCtx = null

function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

export function playWhoosh() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime

    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(650, now)
    oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.18)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  } catch {
    // Web Audio unsupported/blocked (e.g. autoplay policy) — sound is a
    // nice-to-have, fail silently.
  }
}