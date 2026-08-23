import confetti from "canvas-confetti"

// A quick celebratory burst for high scores (80+) — kept as its own tiny
// wrapper so the confetti config lives in exactly one place.
export function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.7 },
    colors: ["#7dd3bf", "#ffcb77", "#fe6d73", "#2584a7"],
  })
}