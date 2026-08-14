import { Image, Sparkles, KeyRound, Smartphone, Flame, Trophy, UserCircle, Mic } from "lucide-react"

const features = [
  {
    icon: Image,
    title: "Real photos",
    desc: "Everyday scenes, not abstract stuff that's hard to even describe.",
    comingSoon: false,
  },
  {
    icon: Sparkles,
    title: "Instant AI feedback",
    desc: "Grammar checked, mistakes pointed out, a better version shown.",
    comingSoon: false,
  },
  {
    icon: KeyRound,
    title: "Bring your own key",
    desc: "Use your own Gemini key, no account needed, use it as much as you want.",
    comingSoon: false,
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    desc: "Dark mode, light mode, phone, laptop — all covered.",
    comingSoon: false,
  },
  {
    icon: Flame,
    title: "Streaks",
    desc: "Keep a daily practice streak going.",
    comingSoon: true,
  },
  {
    icon: Trophy,
    title: "XP & levels",
    desc: "Level up as you practice more.",
    comingSoon: true,
  },
  {
    icon: UserCircle,
    title: "Profile & history",
    desc: "See your past attempts and track progress over time.",
    comingSoon: true,
  },
  {
    icon: Mic,
    title: "Voice input",
    desc: "Speak your description instead of typing it.",
    comingSoon: true,
  },
]

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          What you get
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          some of this works right now, some of it's coming soon
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className={`relative rounded-2xl p-5 backdrop-blur-md ${
                feature.comingSoon
                  ? "border border-dashed border-amber-300/60 dark:border-amber-400/30 bg-amber-50/40 dark:bg-amber-400/5"
                  : "border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5"
              }`}
            >
              {feature.comingSoon && (
                <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}

              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${
                  feature.comingSoon
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-primary/10 text-primary "
                }`}
              >
                <Icon size={20} />
              </div>

              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-6">
                {feature.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}