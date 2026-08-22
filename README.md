# 👁️ SceneSpeak

> see a pic, describe it, get roasted (nicely) by AI until your English sounds fire 🔥

no cap, most language apps make you grind grammar drills that put you to sleep. SceneSpeak just throws a real photo at you, you type what's happening in it, and an AI tells you straight up what sounded off — plus how you could've said it better. that's genuinely the whole app.

built this to actually get better at describing stuff in English without the boring textbook energy, and also to have a real project to flex on my portfolio lol.

## 🧪 what's the vibe

- **real photos, not weird abstract art** — you're describing an actual scene, not guessing what a blob painting means
- **instant AI feedback** — no waiting around, it just tells you what's wrong and fixes it for you
- **your own image too** — got a photo you actually want to talk about? upload it, no curated-gallery-only nonsense
- **native way / gen-z way** — every curated photo comes with both a native-speaker phrasing and a chaotic gen-z one, loads instantly, zero API calls
- **quick-fire templates** — one-tap buttons for grammar errors, suggestions, native rewrite, gen-z rewrite, explain-my-errors
- **sessions, your way** — nothing saves by default; click the "Untitled" title to name (and save) a session, and it silently keeps itself updated after that. delete/resume from the dropdown whenever
- **BYOK (bring your own key)** — pop in your own Gemini/ChatGPT API key, use it as much as you want, no cap on usage
- **zero signup required** — just show up and start practicing, we're not gatekeeping anything
- **dark mode / light mode** — obviously
- **actually works on your phone too** — proper mobile layout, sticky image up top, not just desktop-only like some apps pretend mobile doesn't exist

## 🔮 coming later (not real yet, don't @ me)

- ☁️ Firebase-backed sessions & curated dataset — right now sessions live in your browser's localStorage and curated images are a local JS file, both temporary until this migration
- 🔐 real auth — sessions are anonymous-per-browser for now, login comes later and reuses the same Firebase setup
- 🔥 daily streaks — keep the grind going
- 🏆 XP & levels — number go up
- 👤 profile + history — see your glow-up over time
- 🎙️ voice input — talk instead of type
- 👯 friends leaderboard — flex on your friends

## 🛠️ built with

- **React** (Vite) — no Next.js this time, wanted to actually learn React properly
- **Tailwind CSS** — for that liquid glass aesthetic you see everywhere
- **Firebase** — auth + database, coming soon for sessions & the curated image set
- **Gemini / OpenAI APIs** — the brains of the whole operation, pick whichever you've got a key for
- **React Router** — for the multi-page stuff

## 🚀 running this locally

```bash
git clone https://github.com/tanujbishtt/ScreenSpeak.git
cd ScreenSpeak
npm install
npm run dev
```

you'll need your own Gemini (or OpenAI) API key to actually use the practice feature — grab one free from [Google AI Studio](https://aistudio.google.com/) or [OpenAI](https://platform.openai.com/api-keys), paste it in when the app asks.

## 📍 where this is at right now

- ✅ landing page — done, looks decent ngl
- ✅ dark/light mode — working
- ✅ workspace / practice page — built: curated gallery, your-own-image upload, chat feedback, quick templates, vocab/solution/native-genz reference, sessions (save/rename/resume/delete/new), mobile-responsive layout
- ✅ Gemini + ChatGPT integration — both wired up via BYOK
- 🚧 curated image dataset — currently a local temp file, migrating to Firestore once the curated set is finalized
- 🚧 sessions storage — currently localStorage, migrating to Firestore (anonymous auth already set up for this)
- ⏳ real auth, profile, streaks, XP, all that — later phases

## 🤳 find me

- GitHub: [@tanujbishtt](https://github.com/tanujbishtt)
- LinkedIn: [tanuj-bisht](https://www.linkedin.com/in/tanuj-bisht/)

---

built solo, powered by way too much chai and the confidence that comes from not knowing what you don't know yet 😮‍💨