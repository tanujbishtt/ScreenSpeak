import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// Note: the old dev-only "/api/openai" and "/api/claude" proxy rules are
// gone — the app now always calls "/api/gemini", "/api/openai", and
// "/api/claude", which are served by the Cloudflare Pages Functions in
// /functions/api/. Plain `npm run dev` won't run those functions, so for
// local testing that needs real AI replies, use Wrangler instead:
//
//   npx wrangler pages dev --proxy 5173 -- npm run dev
//
// with a .dev.vars file (gitignored) holding GEMINI_API_KEY / OPENAI_API_KEY
// for local testing. See README for details.
export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
