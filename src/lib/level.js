// Level is DERIVED from totalDescribed, never stored separately — so it
// can never drift out of sync with the real stat.
// 1-4 described = Level 1, 5-9 = Level 2, 10-14 = Level 3, and so on.
export function getLevel(totalDescribed) {
  return Math.floor(totalDescribed / 5) + 1
}

// How many more described images until the next level.
export function toNextLevel(totalDescribed) {
  const inCurrentLevel = totalDescribed % 5
  return 5 - inCurrentLevel
}