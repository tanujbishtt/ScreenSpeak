import { ImagePlus, PenLine, Sparkles } from "lucide-react"

const steps = [
  {
    icon: ImagePlus,
    title: "See a photo",
    desc: "We show you a real, everyday scene — someone cooking, kids playing, whatever.",
  },
  {
    icon: PenLine,
    title: "Describe it",
    desc: "Type out what's happening, in your own words. No pressure, just try.",
  },
  {
    icon: Sparkles,
    title: "Get feedback",
    desc: "AI checks your grammar, points out what's off, and shows you a better version.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          How it works
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          three steps, that's genuinely it
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md p-6"
            >
              <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="h-11 w-11 rounded-xl bg-primary/10 /10 flex items-center justify-center mb-4">
                <Icon size={22} className="text-primary " />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6">
                {step.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}