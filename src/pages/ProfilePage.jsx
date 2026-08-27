import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft, Trophy, Lock, LogIn, LogOut, User as UserIcon,
} from "lucide-react"
import Logo from "../components/layout/Logo"
import ThemeToggle from "../components/layout/ThemeToggle"
import { useAuth } from "../hooks/useAuth"
import { useAchievements } from "../hooks/useAchievements"
import { getLevel, toNextLevel } from "../lib/level"
import { ACHIEVEMENT_ICONS } from "../lib/achievementIcons"
import { fireConfetti } from "../lib/confetti"
import { playWhoosh } from "../lib/sound"

const LAST_CELEBRATED_LEVEL_KEY = "scenespeak_last_celebrated_level"

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface/70 p-3.5 text-center transition-transform active:scale-95">
      <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, authLoading, signInWithGoogle, signOutUser } = useAuth()
  const { stats, achievements } = useAchievements()

  const level = getLevel(stats.totalDescribed)
  const remaining = toNextLevel(stats.totalDescribed)
  const progressInLevel = stats.totalDescribed % 5
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  // Small "arriving" cue on open — same whoosh already used for sending a
  // chat message, reused here since it's a plain Web Audio synth (no file,
  // no bundle cost) and works identically whether you're on mobile or desktop.
  useEffect(() => {
    playWhoosh()
  }, [])

  // Level number counts up from 1 to `level` on mount instead of just
  // popping in — same idea as the ScoreRing counter in the workspace chat.
  const [displayLevel, setDisplayLevel] = useState(1)
  useEffect(() => {
    if (level <= 1) {
      setDisplayLevel(level)
      return
    }
    let frame
    const start = performance.now()
    const DURATION = 600
    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayLevel(Math.max(1, Math.round(1 + eased * (level - 1))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [level])

  // Confetti the first time this page is viewed after leveling up. We
  // remember the last level we celebrated in localStorage so it only fires
  // once per level, not on every profile visit.
  const hasCelebrated = useRef(false)
  useEffect(() => {
    if (hasCelebrated.current) return
    const lastCelebrated = Number(localStorage.getItem(LAST_CELEBRATED_LEVEL_KEY) ?? 1)
    if (level > lastCelebrated) {
      hasCelebrated.current = true
      fireConfetti()
      localStorage.setItem(LAST_CELEBRATED_LEVEL_KEY, String(level))
    }
  }, [level])

  // Tapping a card gives feedback either way: locked shakes (a "not yet"
  // no), unlocked replays its unlock pop (a little celebratory reminder).
  const [tappedId, setTappedId] = useState(null)

  function handleAchievementTap(id) {
    setTappedId(id)
    window.setTimeout(() => setTappedId(null), 500)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex h-14 items-center gap-3 border-b border-border bg-canvas/85 px-4 backdrop-blur-xl">
        <Link
          to="/workspace"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Workspace
        </Link>
        <div className="flex flex-1 items-center justify-center gap-2">
          <Logo size={20} />
          <span className="text-sm font-semibold text-slate-800 dark:text-white">Profile</span>
        </div>
        <ThemeToggle className="text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" />
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Identity */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-surface/70 p-5">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <UserIcon size={20} />
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{user?.displayName ?? "Guest"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email ?? "Progress is saved on this device only"}
              </p>
            </div>
          </div>

          {!authLoading && (
            user ? (
              <button
                onClick={signOutUser}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-surface-muted dark:text-slate-300 dark:hover:bg-white/5"
              >
                <LogOut size={13} />
                Sign out
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <LogIn size={13} />
                Sign in to sync
              </button>
            )
          )}
        </div>

        {/* Level progress */}
        <div className="mb-6 rounded-2xl border border-border bg-surface/70 p-5">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Level {displayLevel}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {remaining} more to Level {level + 1}
            </p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
              style={{ width: `${(progressInLevel / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Images described" value={stats.totalDescribed} />
          <StatCard label="Best streak" value={stats.bestStreak} />
          <StatCard label="Best score" value={stats.bestScore} />
          <StatCard label="Ref. tab views" value={stats.referenceTabViews} />
        </div>

        {/* Achievements */}
        <div>
          <p className="mb-3 text-sm font-semibold text-slate-800 dark:text-white">
            Achievements — {unlockedCount}/{achievements.length}
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {achievements.map((a) => {
              const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Trophy
              return (
                <div
                  key={a.id}
                  onClick={() => handleAchievementTap(a.id)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface/70 p-3.5 transition-transform active:scale-[0.98] ${
                    a.unlocked ? "" : "opacity-40"
                  } ${tappedId === a.id ? (a.unlocked ? "animate-achievement-in" : "animate-shake") : ""}`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      a.unlocked
                        ? "bg-primary/15 text-primary"
                        : "bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-500"
                    }`}
                  >
                    {a.unlocked ? <Icon size={18} /> : <Lock size={15} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}