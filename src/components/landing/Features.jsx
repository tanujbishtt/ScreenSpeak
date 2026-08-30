import {
  Image,
  Sparkles,
  KeyRound,
  UserCircle,
  Trophy,
  ImagePlus,
  SlidersHorizontal,
  Mic,
} from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import WaveDivider from "../ui/WaveDivider";
import { Sparkle, DottedPlus, Dot } from "../ui/Decorations";

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
    icon: UserCircle,
    title: "Profile & history",
    desc: "Every attempt saved, so you can look back and see the progress.",
    comingSoon: false,
  },
  {
    icon: Trophy,
    title: "Achievements",
    desc: "Little unlocks for streaks, perfect scores, and just showing up.",
    comingSoon: false,
  },
  {
    icon: ImagePlus,
    title: "Bring your own photo",
    desc: "Upload a scene of your own instead of picking from the bank.",
    comingSoon: false,
  },
  {
    icon: SlidersHorizontal,
    title: "Toggle the tone",
    desc: 'Switch feedback between "roast me" and "encourage me" modes.',
    comingSoon: false,
  },
  {
    icon: Mic,
    title: "Voice input",
    desc: "Speak your description instead of typing it.",
    comingSoon: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-cream px-6 pb-40 pt-20">
      <DottedPlus size={20} className="absolute left-10 top-12 text-ink/40" />
      <Sparkle
        size={18}
        className="absolute right-14 top-20 text-brut-orange/60"
      />
      <Dot size={10} className="absolute bottom-16 left-1/4 text-brut-teal" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-extrabold text-ink lg:text-4xl">
            What you get
          </h2>
          <p className="mt-2 font-display text-ink-muted">
            most of this works right now, a few things are still cooking
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className={`relative p-5 ${feature.comingSoon ? "border-dashed" : ""}`}
              >
                {feature.comingSoon && (
                  <Badge className="absolute -right-2 -top-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-brutal-sm">
                    Soon
                  </Badge>
                )}

                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink ${
                    feature.comingSoon ? "bg-cream-panel" : "bg-brut-yellow"
                  }`}
                >
                  <Icon size={20} className={feature.comingSoon ? "text-ink" : "text-ink-fixed"} />
                </div>

                <h3 className="mb-1 font-display font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-ink-muted">
                  {feature.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      <WaveDivider fill="fill-block-yellow" />
    </section>
  );
}