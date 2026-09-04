# 👁️ SceneSpeak

> see a pic, describe it, get roasted (nicely) by AI until your English actually sounds fire 🔥

**Live:** [scenespeak.pages.dev](https://scenespeak.pages.dev/)
**Repo:** [github.com/tanujbishtt/SceneSpeak](https://github.com/tanujbishtt/SceneSpeak)

most language apps make you grind grammar drills that put you to sleep in 5 minutes. SceneSpeak just throws a real photo at you, you type what's happening in it, and an AI tells you straight up what sounded off — plus how a native speaker (or a Gen-Z kid, or Shakespeare himself lol) would've said it instead. that's genuinely the whole loop, and it works.

built this to actually get better at describing stuff in English without boring textbook energy, and also to finally have a real, deployed, full-stack project on my portfolio instead of another to-do list app 💀

## 🧪 what's actually in here

- **real photos, not weird abstract art** — you're describing an actual scene (someone caught in the rain, kids playing cricket, whatever), not guessing what a random blob painting means
- **your own image too** — got a photo you actually want to talk about? upload it, no curated-gallery-only nonsense (goes through Cloudinary so it's not sitting on my server)
- **instant AI feedback, streamed** — responses stream in token by token like a real chatbot, not a loading spinner followed by a wall of text
- **quick-fire feedback templates** — one-tap buttons for Grammar Errors, Suggestions, and Explain My Errors, each hitting the AI with a focused prompt instead of you typing "how did I do"
- **native way / gen-z way / shakespearean way** — every curated photo comes pre-loaded with a native-speaker phrasing, a chaotic gen-z one, and a full Shakespearean rewrite. these are static (authored ahead of time, sitting in Firestore) so they load instantly with zero API calls
- **actual conversation, not just templates** — you can also just type follow-ups and keep chatting with the AI about the image like a tutor, it's not templates-only
- **pick your own AI brain (BYOK)** — Gemini, OpenAI, or Claude, your call. bring your own API key for unlimited use, or use the app's free daily quota
- **google sign-in + real accounts** — Firebase Auth, one-tap Google login. sign in and your sessions/achievements/streaks move from your browser's local storage into the cloud automatically, no data lost
- **sessions that save themselves** — click the "Untitled" title to name (and save) a session, it silently keeps itself updated after that. rename, resume, or delete from the dropdown whenever
- **gamification that isn't fake** — XP, levels, streaks (best streak, current streak, even a "loss streak" achievement if you're just bad and keep going lol), and a real achievements list with icons, tracked per-user in Firestore
- **profile page** — see your level, stats, and unlocked achievements, with a little level-up animation + confetti because why not
- **dark mode / light mode** — a proper neo-brutalist theme (bold borders, hard offset shadows, sparkle accents) that's actually been tuned for dark mode too, not just an inverted color slapped on top
- **fully mobile-responsive** — sticky image up top on phone, independently scrolling panels, no janky desktop-only layout pretending mobile doesn't exist

## 🧠 how the AI part actually works (the fun bit)

the browser never talks to Gemini/OpenAI/Claude directly when you're using the app's free quota — it hits a Cloudflare Pages Function (`/api/gemini`, `/api/openai`, `/api/claude`) that lives server-side, holds the *real* API keys as Cloudflare secrets, and proxies the request. this way my own keys never show up in devtools' network tab, and I can rotate through multiple keys server-side if one hits its quota. if you bring your own key instead (BYOK), that goes straight from your browser to the provider — I never see it.

## 🛠️ built with

- **React 19** (Vite, not Next.js this time) — wanted to actually learn React/Tailwind properly on a real project before going back to Next.js
- **Tailwind CSS v4**
- **Firebase** — Auth (Google sign-in) + Firestore (sessions, achievements, user profiles, and the whole curated image dataset)
- **Cloudinary** — unsigned uploads for user-submitted images, so I'm not hosting media myself
- **Gemini / OpenAI / Claude APIs** — pick your provider, BYOK or app default
- **Cloudflare Pages + Pages Functions** — hosting the static build *and* the serverless API proxy in one place
- **React Router** — landing / workspace / profile pages
- **canvas-confetti + a tiny Web Audio synth** — for level-ups and score celebrations, because a plain "+10 XP" text felt dead

## 🚀 running this locally

```bash
git clone https://github.com/tanujbishtt/SceneSpeak.git
cd SceneSpeak
npm install
```

you'll need two sets of env vars:

1. **`.env`** (copy from `.env.example`) — your own Firebase project config + Cloudinary cloud name/upload preset. these are `VITE_`-prefixed on purpose, since they're safe to ship in the browser bundle.
2. **`.dev.vars`** (copy from `.dev.vars.example`) — your Gemini/OpenAI/Claude API keys, comma-separated if you've got more than one to rotate through. these power the app's free-tier default keys and are read server-side only by the Cloudflare Functions, so no `VITE_` prefix here (that'd leak them into the client bundle).

then:

```bash
npm run dev
```

if you want to test the `/api/*` serverless functions locally too (not just the frontend), use `wrangler pages dev` instead of plain `vite dev` so the Functions actually run.

or skip all of that — just paste your own Gemini/OpenAI/Claude key into the app's BYOK field once it's running and you're good, no `.dev.vars` needed for that path.

## 📍 where this is at right now

- ✅ landing page — neo-brutalist redesign, done, dark mode included
- ✅ workspace / practice page — curated gallery + your-own-image upload, streaming chat feedback, quick templates, native/gen-z/shakespearean reference tabs, full session management
- ✅ Gemini + OpenAI + Claude — all three wired up, BYOK or app default (server-proxied, key rotation on quota errors)
- ✅ Firebase Auth (Google sign-in) — with automatic migration of local sessions/achievements into Firestore the moment you log in
- ✅ curated image dataset — 70+ hand-picked images, fully in Firestore
- ✅ achievements, XP, levels, streaks — all tracked, all working
- ✅ profile page — stats, level, unlocked achievements
- ✅ deployed on Cloudflare Pages, custom Functions for the AI proxy
- 🚧 voice input — planned, not started
- 🚧 friends / leaderboard — planned, not started

## 🤳 find me

- GitHub: [@tanujbishtt](https://github.com/tanujbishtt)
- LinkedIn: [tanuj-bisht](https://www.linkedin.com/in/tanuj-bisht/)

---

built solo, powered by way too much chai and the confidence that comes from not knowing what you don't know yet 😮‍💨
