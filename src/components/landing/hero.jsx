import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Sparkle, DottedPlus, Dot } from "../ui/Decorations";
import WaveDivider from "../ui/WaveDivider";

import handbook from "../../assets/handbook.png";
import hand from "../../assets/hand.png";
import sunflower from "../../assets/sunflower.png";
import star from "../../assets/star.png";

export default function Hero() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  async function handleSignInClick() {
    if (user) {
      navigate("/workspace");
      return;
    }
    try {
      await signInWithGoogle();
      navigate("/workspace");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  }

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative z-10">
            <Badge className="mb-6">
              <Sparkle size={14} className="text-brut-orange" />
              Built because Duolingo wasn't enough
            </Badge>

            <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-ink lg:text-6xl">
              Stop translating.
              <span className="mt-1 block text-brut-orange">
                Start thinking in English.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-muted">
              Describe real photos in your own words, and get instant feedback
              on your grammar, vocabulary, and fluency. Less time memorizing
              rules. More time actually using English.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to="/workspace" variant="yellow" size="lg">
                Give it a Shot
              </Button>

              <Button onClick={handleSignInClick} variant="white" size="lg">
                {user ? "Continue" : "Sign In"}
              </Button>
            </div>
          </div>

          <div className="relative hidden h-150 justify-center lg:block">
            <div className="absolute right-0 top-0 w-45 rotate-6 transition-transform duration-300 hover:scale-110">
              <img
                src={star}
                alt=""
                className="w-full animate-float-slow drop-shadow-[3px_5px_10px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_0_14px_rgba(245,240,230,0.12)]"
              />
            </div>

            <div className="absolute right-90 top-2 z-10 w-60 transition-transform duration-300 hover:scale-105">
              <img
                src={hand}
                alt=""
                className="w-full animate-float-slower drop-shadow-[4px_6px_12px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_0_16px_rgba(245,240,230,0.12)]"
              />
            </div>

            <div className="absolute right-30 top-20 z-20 h-125 rotate-3 transition-transform duration-300 hover:scale-105">
              <img
                src={handbook}
                alt="Hand holding a book"
                className="h-full w-auto animate-float-slowest drop-shadow-[5px_8px_16px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_20px_rgba(245,240,230,0.14)]"
              />
            </div>

            <div className="absolute bottom-0 left-0 z-30 w-65 -rotate-3 transition-transform duration-300 hover:scale-105">
              <img
                src={sunflower}
                alt=""
                className="w-full animate-float-slow drop-shadow-[4px_6px_12px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_0_16px_rgba(245,240,230,0.12)]"
              />
            </div>

            <Badge className="absolute left-0 top-4 z-40 -rotate-3 !bg-brut-yellow !text-ink-fixed transition-transform duration-200 hover:-rotate-6 hover:scale-110">
              ✓ nice vocab honestly
            </Badge>

            <Badge className="absolute bottom-40 right-2 z-40 rotate-2 bg-cream-surface transition-transform duration-200 hover:rotate-6 hover:scale-110">
              try "is walking" instead
            </Badge>

            <DottedPlus
              size={20}
              className="absolute left-16 top-1/2 text-ink/50"
            />
            <Dot
              size={10}
              className="absolute right-1/3 top-1/3 text-brut-teal"
            />
            <Sparkle
              size={16}
              className="absolute left-1/2 top-1/3 -translate-x-1/2 text-brut-orange/60"
            />
            <Dot size={8} className="absolute left-1/4 bottom-16 text-ink/30" />
            <DottedPlus
              size={16}
              className="absolute right-1/4 bottom-1/4 text-ink/30"
            />
          </div>
        </div>
      </div>

      <WaveDivider fill="fill-block-teal" />
    </section>
  );
}