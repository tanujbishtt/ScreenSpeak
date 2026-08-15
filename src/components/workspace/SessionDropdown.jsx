import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SessionDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex items-center gap-1.5
          rounded-lg
          px-2 py-1.5
          text-sm font-medium
          text-slate-700
          transition
          hover:bg-surface
          dark:text-slate-200
          dark:hover:bg-white/5
        "
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Session 1
        <ChevronDown
          size={15}
          className={`
            text-slate-400
            transition-transform
            duration-200
            dark:text-slate-500
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {isOpen && (
        <div
          className="
    absolute
    left-0
    top-[calc(100%+8px)]
    z-100
    w-64
    overflow-hidden
    rounded-2xl
    border
    border-border
    bg-surface/90
    p-1.5
    shadow-[0_18px_50px_rgba(40,30,20,0.15)]
    backdrop-blur-2xl
    dark:shadow-[0_18px_50px_rgba(0,0,0,0.4)]
  "
        >
          <button
            className="
              flex w-full items-center justify-between
              rounded-xl
              px-3 py-2.5
              text-left
              transition
              hover:bg-surface-muted
              dark:hover:bg-white/5
            "
          >
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                Session 1
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Current session
              </p>
            </div>

            <span className="h-2 w-2 rounded-full bg-primary" />
          </button>

          <div className="my-1.5 h-px bg-border" />

          <button
            className="
              flex w-full items-center
              rounded-xl
              px-3 py-2.5
              text-left
              transition
              hover:bg-surface-muted
              dark:hover:bg-white/5
            "
          >
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                New Session
              </p>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Start a fresh practice
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
