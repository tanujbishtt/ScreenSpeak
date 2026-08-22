// TEMP data source. Once curated set is finalized, this content moves into
// Firestore (collection: "curatedImages") and this file gets replaced by a
// fetch call — shape stays identical so nothing else needs to change.

export const curatedImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    category: "daily life",
    vocab: [
      { word: "stroll", meaning: "to walk in a slow, relaxed way" },
      { word: "pavement", meaning: "the paved path beside a road, for walking" },
    ],
    solution: "A woman is strolling down the pavement, checking her phone as she walks.",
    nativeWay: "She's just strolling along, scrolling through her phone.",
    genZWay: "she's out here vibing, phone in hand, zero rush 💀",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
    category: "weather",
    vocab: [
      { word: "downpour", meaning: "a sudden, heavy fall of rain" },
      { word: "shelter", meaning: "a place giving protection from bad weather" },
    ],
    solution: "Dark clouds are gathering as rain begins to pour down on the street.",
    nativeWay: "Looks like it's about to absolutely pour any second now.",
    genZWay: "sky's looking mad depressed rn, downpour incoming fr 😭",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=800&q=80",
    category: "sports & play",
    vocab: [
      { word: "sprint", meaning: "to run at full speed over a short distance" },
      { word: "teammate", meaning: "a person who plays on the same team as you" },
    ],
    solution: "A group of kids are sprinting across the field, chasing after the ball.",
    nativeWay: "The kids are booking it across the field after the ball.",
    genZWay: "these kids sprinting like the ball owes them money 💀",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    category: "food & cooking",
    vocab: [
      { word: "simmer", meaning: "to cook gently in liquid just below boiling point" },
      { word: "garnish", meaning: "a decoration added to a dish before serving" },
    ],
    solution: "Someone is stirring a pot of soup that's simmering on the stove.",
    nativeWay: "They're giving the soup a stir while it simmers away.",
    genZWay: "chef mode activated, soup simmering, no notes 🔥",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?auto=format&fit=crop&w=800&q=80",
    category: "animals & pets",
    vocab: [
      { word: "leash", meaning: "a strap or cord used to hold and control an animal" },
      { word: "wag", meaning: "to move something (like a tail) quickly side to side" },
    ],
    solution: "A dog is wagging its tail happily while its owner holds the leash.",
    nativeWay: "The dog's tail is going crazy while its owner keeps it on the leash.",
    genZWay: "dog's tail wagging at like 200bpm rn, pure joy fr 🐶",
  },
]