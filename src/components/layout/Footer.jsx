import { Link } from "react-router-dom";

function GithubIcon({ size = 17, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.19-3.37-1.19-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon({ size = 17, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45Z" />
    </svg>
  );
}

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
