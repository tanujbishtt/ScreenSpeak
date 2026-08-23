import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      // Browser calls to /api/openai/... get forwarded to api.openai.com
      // by Vite's own Node server (not the browser) — so there's no
      // cross-origin request from the browser's point of view at all,
      // meaning no CORS check ever happens. This ONLY applies to `npm run
      // dev`; a deployed production build will need an equivalent proxy
      // (e.g. a serverless function) since there's no dev server then.
      "/api/openai": {
        target: "https://api.openai.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ""),
      },
    },
  },
})