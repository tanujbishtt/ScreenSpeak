import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Button from "../ui/Button";
import { GithubIcon } from "../icons/BrandIcons";

const navLinks = [{ name: "Home", path: "/" }];

const anchorLinks = [
  { name: "How it Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  function handleHomeClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header className="relative border-b-2 border-ink bg-cream">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-xl font-bold text-ink">
          Scene<span className="text-brut-orange">Speak</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={link.path === "/" ? handleHomeClick : undefined}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-display text-[15px] font-medium transition-colors ${
                  isActive
                    ? "text-ink underline decoration-2 underline-offset-4"
                    : "text-ink-muted hover:text-ink"
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
              className="rounded-lg px-3 py-2 font-display text-[15px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/tanujbishtt/ScreenSpeak"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-cream-surface px-3 py-1.5 font-display text-sm font-medium text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5 sm:flex"
          >
            <GithubIcon size={15} />
            Star
          </a>

          <Button
            to="/workspace"
            variant="yellow"
            size="md"
            className="hidden md:inline-flex"
          >
            Practice
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-cream-surface text-ink shadow-brutal-sm md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`
          overflow-hidden border-t-2 border-ink bg-cream-surface
          transition-all duration-300 md:hidden
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                setIsOpen(false);
                if (link.path === "/") handleHomeClick();
              }}
              className="rounded-lg px-3 py-2.5 font-display text-[15px] font-medium text-ink"
            >
              {link.name}
            </Link>
          ))}
          {anchorLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-3 py-2.5 font-display text-[15px] font-medium text-ink"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
