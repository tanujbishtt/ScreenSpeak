import confetti from "canvas-confetti"

export function fireConfetti() {
  const colors = [
    "#7dd3bf",
    "#ffcb77",
    "#fe6d73",
    "#2584a7",
    "#ffffff",
  ]

  // Main burst
  confetti({
    particleCount: 75,
    spread: 75,
    startVelocity: 42,
    gravity: 0.9,
    ticks: 180,
    scalar: 0.9,
    drift: 0.2,
    origin: {
      x: 0.5,
      y: 0.65,
    },
    colors,
  })

  // Smaller "sparkle" burst slightly later
  setTimeout(() => {
    confetti({
      particleCount: 35,
      spread: 100,
      startVelocity: 28,
      gravity: 1.15,
      ticks: 140,
      scalar: 0.65,
      origin: {
        x: 0.5,
        y: 0.62,
      },
      colors,
    })
  }, 90)
}
