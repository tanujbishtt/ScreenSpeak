import { Link } from "react-router-dom";
import { GithubIcon, LinkedinIcon } from "../icons/BrandIcons"

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/workspace" },
];

export default function Footer() {
  return (
    <>
      <footer className="mt-20 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Brand */}
            <div className="max-w-xs">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                SceneSpeak
              </span>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-6">
                A little side project to get better at describing the world in
                English, one photo at a time.
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-16">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Navigate
                </h4>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Find me
                </h4>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/tanujbishtt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                    aria-label="GitHub"
                  >
                    <GithubIcon size={17} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/tanuj-bisht/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={17} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-400 dark:text-slate-500">
            built with way too much coffee, by tanuj 🐸
          </div>
        </div>
      </footer>
    </>
  );
}
