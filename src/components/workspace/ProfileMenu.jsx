import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { LogIn, LogOut, User as UserIcon, ChevronRight } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { getLevel, toNextLevel } from "../../lib/level"

export default function ProfileMenu({ totalDescribed, achievements }) {
  const { user, authLoading, signInWithGoogle, signOutUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const level = getLevel(totalDescribed)
  const remaining = toNextLevel(totalDescribed)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  if (authLoading) return null

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border-2 border-ink bg-cream-surface py-1 pl-1 pr-3 font-display text-sm font-medium text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full border-2 border-ink" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-brut-yellow text-ink">
            <UserIcon size={13} />
          </span>
        )}
        <span className="hidden sm:inline">Lvl {level}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-100 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border-2 border-ink bg-cream-surface p-4 shadow-brutal-lg">
          <div className="mb-3 flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full border-2 border-ink" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-brut-yellow text-ink">
                <UserIcon size={18} />
              </div>
            )}
            <div>
              <p className="font-display text-sm font-semibold text-ink">
                {user?.displayName ?? "Guest"}
              </p>
              <p className="text-xs text-ink-muted">
                {user?.email ?? "Progress saved on this device"}
              </p>
            </div>
          </div>

          <div className="mb-3 rounded-xl border-2 border-ink bg-cream-panel p-3">
            <p className="font-display text-xs font-medium text-ink-muted">Level {level}</p>
            <p className="text-[11px] text-ink-muted">
              {remaining} more {remaining === 1 ? "image" : "images"} to Level {level + 1} · {unlockedCount}/{achievements.length} achievements
            </p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center justify-between rounded-lg border-2 border-ink bg-cream-panel px-3 py-2 font-display text-sm font-medium text-ink transition hover:bg-cream-surface"
          >
            View full profile
            <ChevronRight size={14} />
          </Link>

          {user ? (
            <button
              onClick={signOutUser}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-ink py-2 font-display text-sm font-medium text-ink transition hover:bg-cream-panel"
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-brut-yellow py-2 font-display text-sm font-semibold text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
            >
              <LogIn size={14} />
              Sign in to sync
            </button>
          )}
        </div>
      )}
    </div>
  )
}