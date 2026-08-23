// Just definitions here — no logic beyond `check`. Adding a new
// achievement later = adding one object here, nothing else changes.

export const achievements = [
  {
    id: "first_steps",
    title: "First Steps",
    description: "Described your first image",
    icon: "Footprints",
    check: (stats) => stats.totalDescribed >= 1,
  },
  {
    id: "three_in_a_row",
    title: "On Fire",
    description: "3 good scores (70+) in a row",
    icon: "Flame",
    check: (stats) => stats.bestStreak >= 3,
  },
  {
    id: "ten_loss_loser",
    title: "10 Loss Loser",
    description: "10 rough scores (below 50) in a row — respect for not quitting",
    icon: "Skull",
    check: (stats) => stats.bestLossStreak >= 10,
  },
  {
    id: "native_curious",
    title: "Native Curious",
    description: "Checked Native/Gen-Z way 5 times",
    icon: "Sparkles",
    check: (stats) => stats.referenceTabViews >= 5,
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Scored a perfect 100",
    icon: "Trophy",
    check: (stats) => stats.bestScore >= 100,
  },
  {
    id: "ten_images",
    title: "Warmed Up",
    description: "Described 10 different images",
    icon: "Images",
    check: (stats) => stats.totalDescribed >= 10,
  },
]