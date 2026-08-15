import { Link } from "react-router-dom";

import { GithubIcon, LinkedinIcon } from "../icons/BrandIcons";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/workspace" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              SceneSpeak
            </span>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              A little side project to get better at describing the world in
              English, one photo at a time.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-16">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Navigate
              </h4>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="
                      text-sm text-slate-500
                      transition hover:text-slate-900
                      dark:text-slate-400 dark:hover:text-white
                    "
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                Find me
              </h4>

              <div className="flex gap-3">
                <a
                  href="https://github.com/tanujbishtt"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    border border-slate-200 text-slate-600
                    transition hover:bg-slate-100 hover:text-slate-900
                    dark:border-white/10 dark:text-slate-300
                    dark:hover:bg-white/10 dark:hover:text-white
                  "
                >
                  <GithubIcon size={17} />
                </a>

                <a
                  href="https://www.linkedin.com/in/tanuj-bisht/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="
                    flex h-9 w-9 items-center justify-center rounded-full
                    border border-slate-200 text-slate-600
                    transition hover:bg-slate-100 hover:text-slate-900
                    dark:border-white/10 dark:text-slate-300
                    dark:hover:bg-white/10 dark:hover:text-white
                  "
                >
                  <LinkedinIcon size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            mt-10 border-t border-slate-200 pt-6 text-center text-xs
            text-slate-400 dark:border-white/10 dark:text-slate-500
          "
        >
          built with way too much coffee, by tanuj 🐸
        </div>
      </div>
    </footer>
  );
}