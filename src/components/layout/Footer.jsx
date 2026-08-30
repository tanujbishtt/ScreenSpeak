import { Link } from "react-router-dom";
import { Sparkle, Dot } from "../ui/Decorations";
import { GithubIcon, LinkedinIcon } from "../icons/BrandIcons";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/workspace" },
];

/**
 * Solid yellow full-bleed footer block, matching the inspo's footer
 * treatment. Social links are small bordered squares instead of plain
 * ghost circles, to stay consistent with the button/badge language.
 */
export default function Footer() {
  return (
    <footer className="bg-brut-yellow">
      <Sparkle size={18} className="absolute right-10 top-8 text-ink/30" />
      <Dot size={8} className="absolute bottom-8 left-8 text-ink/20" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="font-display text-lg font-bold text-ink">
              SceneSpeak
            </span>

            <p className="mt-2 text-sm leading-6 text-ink/70">
              A little side project to get better at describing the world in
              English, one photo at a time.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-16">
            <div>
              <h4 className="mb-3 font-display text-sm font-bold text-ink">
                Navigate
              </h4>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm text-ink/70 transition hover:text-ink"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <h4 className="mb-3 font-display text-sm font-bold text-ink">
                Find me
              </h4>

              <div className="flex gap-3">
                <a
                  href="https://github.com/tanujbishtt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-cream-surface text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
                >
                  <GithubIcon size={16} />
                </a>

                <a
                  href="https://www.linkedin.com/in/tanuj-bisht/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-cream-surface text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
                >
                  <LinkedinIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t-2 border-ink/20 pt-6 text-center text-xs text-ink/60">
          built with way too much coffee, by tanuj 🐸
        </div>
      </div>
    </footer>
  );
}
