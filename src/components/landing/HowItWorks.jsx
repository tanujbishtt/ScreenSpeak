import { ImagePlus, PenLine, Sparkles, LineChart, Rocket } from "lucide-react";
import Badge from "../ui/Badge";
import { Sparkle, DottedPlus, Dot } from "../ui/Decorations";
import WaveDivider from "../ui/WaveDivider";

const steps = [
  {
    icon: ImagePlus,
    title: "Pick a photo",
    desc: "Browse the curated photo bank — real, everyday scenes to describe.",
    active: true,
  },
  {
    icon: PenLine,
    title: "Describe what you see",
    desc: "Write it out in your own words. No rules first, just try.",
  },
  {
    icon: Sparkles,
    title: "Get instant AI feedback",
    desc: "Grammar checked, mistakes flagged, and a native-speaker rewrite shown.",
  },
  {
    icon: LineChart,
    title: "Track your score & streak",
    desc: "See how you did on that attempt, and keep the daily streak alive.",
  },
  {
    icon: Rocket,
    title: "Level up",
    desc: "Earn XP, unlock achievements, and watch your profile grow over time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-block-teal px-6 pb-40 pt-20">
      <DottedPlus size={22} className="absolute left-10 top-10 text-ink/40" />
      <Sparkle size={22} className="absolute right-16 top-16 text-ink/70" />
      <Dot size={8} className="absolute bottom-14 left-1/3 text-ink/40" />

      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-[28px] border-2 border-ink bg-cream-surface p-8 shadow-brutal-lg sm:p-12">
          <div className="mb-16 text-center">
            <Badge className="mb-4 text-xs">005 · Process</Badge>
            <h2 className="font-display text-3xl font-extrabold text-ink lg:text-4xl">
              How We Work
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              Five simple steps, from opening a photo to actually getting better
              at describing the world in English.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-ink/15 lg:block" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              const isLast = i === steps.length - 1;

              return (
                <div
                  key={step.title}
                  className={`relative flex flex-col items-center gap-6 lg:flex-row ${
                    isEven ? "" : "lg:flex-row-reverse"
                  } ${isLast ? "" : "mb-14"}`}
                >
                  <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-brut-orange lg:block" />

                  <div
                    className={`flex w-full justify-center lg:w-1/2 ${
                      isEven
                        ? "lg:justify-end lg:pr-14"
                        : "lg:justify-start lg:pl-14"
                    }`}
                  >
                    <div
                      className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink shadow-brutal ${
                        step.active ? "bg-brut-yellow" : "bg-cream-panel"
                      }`}
                    >
                      <Icon size={26} className={step.active ? "text-ink-fixed" : "text-ink"} />
                      <span className="absolute -bottom-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-cream-surface font-display text-xs font-bold text-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-full text-center lg:w-1/2 ${
                      isEven
                        ? "lg:pl-14 lg:text-left"
                        : "lg:pr-14 lg:text-right"
                    } ${
                      step.active
                        ? "rounded-2xl border-2 border-dashed border-ink/30 bg-brut-yellow/15 p-4"
                        : ""
                    }`}
                  >
                    <h3 className="font-display text-lg font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink-muted">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <WaveDivider fill="fill-cream" />
    </section>
  );
}