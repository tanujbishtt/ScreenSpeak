import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { LogIn, LogOut, User as UserIcon, ChevronRight } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { getLevel, toNextLevel } from "../../lib/level"

// props:
//   totalDescribed — useAchievements().stats.totalDescribed
//   achievements   — useAchievements().achievements (for the unlocked count)
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
        className="flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 pl-1 pr-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-surface dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserIcon size={13} />
          </span>
        )}
        <span className="hidden sm:inline">Lvl {level}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-100 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl">
          <div className="mb-3 flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <UserIcon size={18} />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.displayName ?? "Guest"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email ?? "Progress saved on this device"}
              </p>
            </div>
          </div>

          <div className="mb-3 rounded-xl bg-canvas p-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Level {level}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {remaining} more {remaining === 1 ? "image" : "images"} to Level {level + 1} · {unlockedCount}/{achievements.length} achievements
            </p>
          </div>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="mb-2 flex items-center justify-between rounded-lg bg-canvas px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-surface-muted dark:text-slate-200"
          >
            View full profile
            <ChevronRight size={14} />
          </Link>

          {user ? (
            <button
              onClick={signOutUser}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-sm font-medium text-slate-600 transition hover:bg-surface-muted dark:text-slate-300 dark:hover:bg-white/5"
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
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