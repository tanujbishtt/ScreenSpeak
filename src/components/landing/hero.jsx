import { Link } from "react-router-dom";
import shaku from '../../assets/shaku_bhai.jpg'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute right-20 top-24 h-105 w-105 rounded-full bg-blue-500/15 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">

          {/* Left */}
          <div className="relative z-10">

            <div className="mb-6 inline-flex rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-1.5 text-sm text-slate-600 dark:text-gray-300 backdrop-blur-md">
              Built because Duolingo wasn't enough. 💀
            </div>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 dark:text-white lg:text-6xl">
              Stop translating.
              <span className="mt-1 block text-primary ">
                Start thinking in English.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Describe real photos in your own words, and get instant feedback on your grammar, vocabulary, and fluency. Less time memorizing rules. More time actually using English.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <Link
                to="/workspace"
                className="rounded-2xl bg-primary px-8 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 "
              >
                Give it a Shot
              </Link>

              <button className="rounded-2xl border border-primary px-8 py-3.5 font-semibold text-primary transition-colors hover:bg-blue-50   dark:hover:bg-blue-950/40">
                Sign In
              </button>
            </div>

          </div>

          {/* Right */}
          <div className="relative hidden justify-center lg:flex">

            <img
            sr
              src={shaku}
              alt="Landscape"
              className="h-117.5 w-87.5 rounded-[34px] object-cover shadow-[0_25px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
            />

            {/* Floating Card */}
            <div className="absolute left-0 top-16 rounded-2xl border border-white/10 bg-white/70 px-5 py-4 backdrop-blur-xl shadow-xl dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-green-500">
                ✓ nice vocab honestly
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                that's a solid word choice
              </p>
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-12 left-6 rounded-2xl border border-white/10 bg-white/70 px-5 py-4 backdrop-blur-xl shadow-xl dark:bg-slate-900/70">
              <p className="text-sm font-semibold text-blue-500">
                quick fix
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                try "is walking" instead here
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}