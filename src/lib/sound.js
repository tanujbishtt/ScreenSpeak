// Tiny synthesized "AI send" whoosh — built entirely with Web Audio API.
let audioCtx = null
function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

export function playWhoosh() {
  try {
    const ctx = getContext()
    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.015)
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
    master.connect(ctx.destination)

    // --------------------------------------------------
    // 1. Main rising "whoosh"
    // --------------------------------------------------
    const whoosh = ctx.createOscillator()
    const whooshGain = ctx.createGain()

    whoosh.type = "sine"

    whoosh.frequency.setValueAtTime(180, now)
    whoosh.frequency.exponentialRampToValueAtTime(900, now + 0.11)
    whoosh.frequency.exponentialRampToValueAtTime(480, now + 0.24)

    whooshGain.gain.setValueAtTime(0.0001, now)
    whooshGain.gain.exponentialRampToValueAtTime(0.55, now + 0.025)
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

    whoosh.connect(whooshGain)
    whooshGain.connect(master)

    // --------------------------------------------------
    // 2. Little sparkle / digital chirp
    // --------------------------------------------------
    const sparkle = ctx.createOscillator()
    const sparkleGain = ctx.createGain()

    sparkle.type = "triangle"

    sparkle.frequency.setValueAtTime(900, now + 0.045)
    sparkle.frequency.exponentialRampToValueAtTime(1500, now + 0.12)
    sparkle.frequency.exponentialRampToValueAtTime(700, now + 0.2)

    sparkleGain.gain.setValueAtTime(0.0001, now)
    sparkleGain.gain.exponentialRampToValueAtTime(0.18, now + 0.055)
    sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)

    sparkle.connect(sparkleGain)
    sparkleGain.connect(master)

    // --------------------------------------------------
    // 3. Tiny "pop" at the end
    // --------------------------------------------------
    const pop = ctx.createOscillator()
    const popGain = ctx.createGain()

    pop.type = "sine"

    pop.frequency.setValueAtTime(1100, now + 0.16)
    pop.frequency.exponentialRampToValueAtTime(500, now + 0.23)

    popGain.gain.setValueAtTime(0.0001, now)
    popGain.gain.setValueAtTime(0.2, now + 0.16)
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

    pop.connect(popGain)
    popGain.connect(master)

    whoosh.start(now)
    sparkle.start(now + 0.03)
    pop.start(now + 0.16)

    whoosh.stop(now + 0.26)
    sparkle.stop(now + 0.22)
    pop.stop(now + 0.26)
  } catch {
    // Audio is purely decorative — fail silently.
  }
}