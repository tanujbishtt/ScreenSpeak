import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Lock,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import Logo from "../components/layout/Logo";
import Card from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useAchievements } from "../hooks/useAchievements";
import { getLevel, toNextLevel } from "../lib/level";
import { ACHIEVEMENT_ICONS } from "../lib/achievementIcons";
import { fireConfetti } from "../lib/confetti";
import { playWhoosh } from "../lib/sound";

const LAST_CELEBRATED_LEVEL_KEY = "scenespeak_last_celebrated_level";

function StatCard({ label, value }) {
  return (
    <Card className="p-3.5 text-center active:scale-95">
      <p className="font-display text-xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, authLoading, signInWithGoogle, signOutUser } = useAuth();
  const { stats, achievements } = useAchievements();

  const level = getLevel(stats.totalDescribed);
  const remaining = toNextLevel(stats.totalDescribed);
  const progressInLevel = stats.totalDescribed % 5;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Small "arriving" cue on open — same whoosh already used for sending a
  // chat message, reused here since it's a plain Web Audio synth (no file,
  // no bundle cost) and works identically whether you're on mobile or desktop.
  useEffect(() => {
    playWhoosh();
  }, []);

  // Level number counts up from 1 to `level` on mount instead of just
  // popping in — same idea as the ScoreRing counter in the workspace chat.
  const [displayLevel, setDisplayLevel] = useState(1);
  useEffect(() => {
    if (level <= 1) {
      setDisplayLevel(level);
      return;
    }
    let frame;
    const start = performance.now();
    const DURATION = 600;
    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayLevel(Math.max(1, Math.round(1 + eased * (level - 1))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [level]);

  // Confetti the first time this page is viewed after leveling up. We
  // remember the last level we celebrated in localStorage so it only fires
  // once per level, not on every profile visit.
  const hasCelebrated = useRef(false);
  useEffect(() => {
    if (hasCelebrated.current) return;
    const lastCelebrated = Number(
      localStorage.getItem(LAST_CELEBRATED_LEVEL_KEY) ?? 1,
    );
    if (level > lastCelebrated) {
      hasCelebrated.current = true;
      fireConfetti();
      localStorage.setItem(LAST_CELEBRATED_LEVEL_KEY, String(level));
    }
  }, [level]);

  // Tapping a card gives feedback either way: locked shakes (a "not yet"
  // no), unlocked replays its unlock pop (a little celebratory reminder).
  const [tappedId, setTappedId] = useState(null);

  function handleAchievementTap(id) {
    setTappedId(id);
    window.setTimeout(() => setTappedId(null), 500);
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex h-14 items-center gap-3 border-b-2 border-ink bg-cream px-4">
        <Link
          to="/workspace"
          className="flex items-center gap-1.5 font-display text-sm font-medium text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} />
          Workspace
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <Logo size={46} />
          <span className="font-display text-sm font-semibold text-ink">
            Profile
          </span>
        </div>
        <span className="w-8" aria-hidden="true" />
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Identity */}
        <Card className="mb-6 flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="h-12 w-12 rounded-full border-2 border-ink"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-brut-yellow text-ink">
                <UserIcon size={20} />
              </div>
            )}
            <div>
              <p className="font-display font-semibold text-ink">
                {user?.displayName ?? "Guest"}
              </p>
              <p className="text-xs text-ink-muted">
                {user?.email ?? "Progress is saved on this device only"}
              </p>
            </div>
          </div>

          {!authLoading &&
            (user ? (
              <button
                onClick={signOutUser}
                className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-cream-surface px-3 py-1.5 font-display text-xs font-semibold text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
              >
                <LogOut size={13} />
                Sign out
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-brut-yellow px-3 py-1.5 font-display text-xs font-semibold text-ink shadow-brutal-sm transition-all hover:-translate-y-0.5"
              >
                <LogIn size={13} />
                Sign in to sync
              </button>
            ))}
        </Card>

        {/* Level progress */}
        <Card className="mb-6 p-5">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="font-display text-lg font-bold text-ink">
              Level {displayLevel}
            </p>
            <p className="text-xs text-ink-muted">
              {remaining} more to Level {level + 1}
            </p>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-ink bg-cream">
            <div
              className="h-full rounded-full bg-brut-orange transition-[width] duration-700 ease-out"
              style={{ width: `${(progressInLevel / 5) * 100}%` }}
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Images described" value={stats.totalDescribed} />
          <StatCard label="Best streak" value={stats.bestStreak} />
          <StatCard label="Best score" value={stats.bestScore} />
          <StatCard label="Ref. tab views" value={stats.referenceTabViews} />
        </div>

        {/* Achievements */}
        <div>
          <p className="mb-3 font-display text-sm font-semibold text-ink">
            Achievements — {unlockedCount}/{achievements.length}
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {achievements.map((a) => {
              const Icon = ACHIEVEMENT_ICONS[a.icon] ?? Trophy;
              return (
                <Card
                  key={a.id}
                  onClick={() => handleAchievementTap(a.id)}
                  className={`flex cursor-pointer items-center gap-3 p-3.5 active:scale-[0.98] ${
                    a.unlocked ? "" : "opacity-40"
                  } ${tappedId === a.id ? (a.unlocked ? "animate-achievement-in" : "animate-shake") : ""}`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink ${
                      a.unlocked
                        ? "bg-brut-yellow text-ink"
                        : "bg-cream text-ink-muted"
                    }`}
                  >
                    {a.unlocked ? <Icon size={18} /> : <Lock size={15} />}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {a.title}
                    </p>
                    <p className="text-xs text-ink-muted">{a.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
