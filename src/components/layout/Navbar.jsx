import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

function GithubIcon({ size = 17, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.19-3.37-1.19-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Practice", path: "/workspace" },
];

const anchorLinks = [
  { name: "How it Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header className="fixed left-1/2 top-5 z-50 w-full max-w-7xl -translate-x-1/2 px-4">
      <nav
        className="
          relative flex h-12 items-center justify-between
          rounded-full border border-white/20
          bg-white/45 px-6
          shadow-[0_4px_24px_rgba(0,0,0,0.08)]
          backdrop-blur-3xl
          dark:border-white/10
          dark:bg-white/5
          dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        "
      >
        {/* Subtle glass highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10" />

        <Link
          to="/"
          className="
            z-10 text-base font-semibold tracking-tight
            text-slate-900 dark:text-white
          "
        >
          SceneSpeak
        </Link>

        <div className="z-10 flex items-center gap-4">
          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {isHome && (
              <>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-1.5 text-[14px] font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-white/20 text-slate-900 dark:bg-white/10 dark:text-white"
                          : "text-slate-600 hover:bg-white/20 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {anchorLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="
                      rounded-full px-3 py-1.5
                      text-[14px] font-medium
                      text-slate-600
                      transition-all duration-300
                      hover:bg-white/20 hover:text-slate-900
                      dark:text-gray-300
                      dark:hover:bg-white/10 dark:hover:text-white
                    "
                  >
                    {link.name}
                  </a>
                ))}
              </>
            )}

            <a
              href="https://github.com/tanujbishtt/scenespeak"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-1.5 rounded-full
                border border-slate-200 px-3 py-1.5
                text-[14px] font-medium text-slate-600
                transition-all duration-300
                hover:bg-white/20 hover:text-slate-900
                dark:border-white/10 dark:text-gray-300
                dark:hover:bg-white/10 dark:hover:text-white
              "
            >
              <GithubIcon size={15} />
              Star
            </a>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
              flex h-8 w-8 items-center justify-center rounded-full
              text-slate-600
              transition-all duration-300
              hover:bg-white/20 hover:text-slate-900
              dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white
            "
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Mobile menu */}
          {isHome && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              className="
                flex h-8 w-8 items-center justify-center rounded-full
                text-slate-900
                transition-all duration-300
                hover:bg-white/20
                dark:text-white dark:hover:bg-white/10
                md:hidden
              "
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={`
          overflow-hidden transition-all duration-300 md:hidden
          ${
            isOpen
              ? "pointer-events-auto mt-3 max-h-96 opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            rounded-3xl border border-white/20
            bg-white/60 p-4
            shadow-lg backdrop-blur-3xl
            dark:border-white/10
            dark:bg-slate-900/60
          "
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/20 text-slate-900 dark:bg-white/10 dark:text-white"
                      : "text-slate-600 hover:bg-white/20 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}