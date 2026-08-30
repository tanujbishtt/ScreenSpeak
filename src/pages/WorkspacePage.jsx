import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomCuratedImage } from "../lib/curatedImages";
import ImageMedia from "../components/workspace/ImageMedia";
import ImageReference from "../components/workspace/ImageReference";
import ChatPanel from "../components/workspace/ChatPanel";
import SessionDropdown from "../components/workspace/SessionDropdown";
import Logo from "../components/layout/Logo";
import { GithubIcon } from "../components/icons/BrandIcons";
import ThemeToggle from "../components/layout/ThemeToggle";
import ApiKeyDropdown from "../components/workspace/ApiKeyDropdown";
import ProfileMenu from "../components/workspace/ProfileMenu";
import { askAI } from "../lib/ai";
import { useAiSettings } from "../hooks/useAiSettings";
import { useSessions } from "../hooks/useSessions";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTonePreference } from "../hooks/useTonePreference";
import { fileToObjectUrl, revokeObjectUrl } from "../lib/fileToObjectUrl";
import { fireConfetti } from "../lib/confetti";
import { useAchievements } from "../hooks/useAchievements";
import AchievementToast from "../components/workspace/AchievementToast";
import { uploadToCloudinary } from "../lib/uploadToCloudinary";
import { stripScoreBlockForDisplay } from "../lib/extractScore";

export default function WorkspacePage() {
  const { provider, apiKey } = useAiSettings();
  const { sessions, upsertSession, deleteSession } = useSessions();
  const isMobile = useIsMobile();
  const { tone, setTone } = useTonePreference();
  const {
    stats,
    achievements,
    newlyUnlocked,
    recordScore,
    recordReferenceView,
    dismissUnlock,
  } = useAchievements();

  const [currentImage, setCurrentImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasDescribed, setHasDescribed] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("Untitled");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const bottomRef = useRef(null);
  const uploadedUrlRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const [imageShrink, setImageShrink] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Curated images now live in Firestore, not in the bundle — the very
  // first image has to be fetched, unlike before when it was available
  // synchronously as the initial state. Runs once on mount.
  useEffect(() => {
    let cancelled = false;
    getRandomCuratedImage().then((image) => {
      if (!cancelled) setCurrentImage(image);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sticky image header shrinks as the mobile page scrolls (Instagram/
  // Twitter-style collapsing header). Only relevant on mobile — the desktop
  // layout's image panel scrolls independently and isn't sticky at all.
  useEffect(() => {
    if (!isMobile) return;
    const el = mobileScrollRef.current;
    if (!el) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setImageShrink(Math.min(el.scrollTop, 64));
        ticking = false;
      });
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => {
    if (!sessionId) return;
    upsertSession({
      id: sessionId,
      name: sessionName,
      image: currentImage,
      messages,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentImage]);

  useEffect(() => {
    return () => revokeObjectUrl(uploadedUrlRef.current);
  }, []);

  function resetForNewImage(image) {
    setCurrentImage(image);
    setMessages([]);
    setHasDescribed(false);
    setActiveTab(null);
    setSessionId(null);
    setSessionName("Untitled");
    mobileScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSkip() {
    revokeObjectUrl(uploadedUrlRef.current);
    uploadedUrlRef.current = null;
    resetForNewImage(await getRandomCuratedImage());
  }

  async function handleUpload(file) {
    revokeObjectUrl(uploadedUrlRef.current);
    const previewUrl = fileToObjectUrl(file);
    uploadedUrlRef.current = previewUrl;
    const localId = `uploaded-${Date.now()}`;
    resetForNewImage({ id: localId, url: previewUrl });

    setIsUploadingImage(true);
    try {
      const cloudUrl = await uploadToCloudinary(file);
      // Only swap the URL in if the user is STILL on this same upload —
      // they might've hit Skip or picked something else while this was
      // in flight, in which case we just let the result drop silently.
      setCurrentImage((prev) =>
        prev.id === localId ? { ...prev, url: cloudUrl } : prev,
      );
      revokeObjectUrl(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    } catch (err) {
      console.error(
        "Cloudinary upload failed, image stays local-only for this tab:",
        err,
      );
      // Not fatal — blob URL still works for the current tab session,
      // it just won't survive a reload/session-resume. No need to block.
    } finally {
      setIsUploadingImage(false);
    }
  }

  function addMessage(message) {
    const id = Date.now() + Math.random();
    setMessages((prev) => [...prev, { id, ...message }]);
    return id;
  }

  function updateMessage(id, patch) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  }

  async function callAI(content, extra = {}, requestScore = false) {
    const newHistory = [...messages, { role: "user", content }];
    addMessage({ role: "user", content, ...extra });

    setIsThinking(true);
    let assistantId = null;
    let acc = "";

    function handleDelta(delta) {
      acc += delta;
      const display = stripScoreBlockForDisplay(acc);
      if (assistantId === null) {
        assistantId = addMessage({
          role: "assistant",
          content: display,
          canRegenerate: false,
        });
      } else {
        updateMessage(assistantId, { content: display });
      }
    }

    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
        requestScore,
        tone,
        onDelta: handleDelta,
      });

      if (assistantId === null) {
        // Stream produced no incremental chunks (rare provider hiccup) —
        // fall back to adding the full reply in one shot instead of
        // silently losing the assistant's message.
        assistantId = addMessage({ role: "assistant", content: reply.text });
      }

      updateMessage(assistantId, {
        content: reply.text,
        score: reply.score,
        corrected: reply.corrected,
        originalText: requestScore ? content : undefined,
        canRegenerate: true,
      });

      if (requestScore && typeof reply.score === "number") {
        recordScore(reply.score);
        if (reply.score >= 80) fireConfetti();
      }
    } catch (err) {
      if (assistantId === null) {
        addMessage({
          role: "assistant",
          content: `Something went wrong: ${err.message}`,
        });
      } else {
        updateMessage(assistantId, {
          content: `Something went wrong: ${err.message}`,
        });
      }
    } finally {
      setIsThinking(false);
    }
  }

  async function handleRegenerate(messageId) {
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    const historyBefore = messages.slice(0, index);
    const requestScore = index === 1; // the very first assistant reply is the only scored one
    setRegeneratingId(messageId);

    let acc = "";
    function handleDelta(delta) {
      acc += delta;
      updateMessage(messageId, { content: stripScoreBlockForDisplay(acc) });
    }

    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: historyBefore.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        requestScore,
        tone,
        onDelta: handleDelta,
      });
      const originalText = requestScore
        ? historyBefore[historyBefore.length - 1]?.content
        : undefined;

      updateMessage(messageId, {
        content: reply.text,
        score: reply.score,
        corrected: reply.corrected,
        originalText,
      });

      if (requestScore && typeof reply.score === "number" && reply.score >= 80)
        fireConfetti();
    } catch (err) {
      updateMessage(messageId, {
        content: `Something went wrong: ${err.message}`,
      });
    } finally {
      setRegeneratingId(null);
    }
  }

  function handleUserMessage(text) {
    const isFirstAttempt = !hasDescribed;
    if (isFirstAttempt) setHasDescribed(true);
    callAI(text, {}, isFirstAttempt);
  }

  function handleTemplateClick(template) {
    callAI(template.prompt, { isTemplate: true, displayLabel: template.label });
  }

  function handleReferenceClick(template) {
    addMessage({
      role: "user",
      content: template.label,
      isTemplate: true,
      displayLabel: template.label,
    });
    addMessage({
      role: "assistant",
      content: currentImage[template.field],
      canRegenerate: false,
    });
    recordReferenceView();
  }

  function handleRenameSession(newName) {
    setSessionName(newName);
    const saved = upsertSession({
      id: sessionId,
      name: newName,
      image: currentImage,
      messages,
    });
    setSessionId(saved.id);
  }

  function handleResumeSession(session) {
    setCurrentImage(session.image);
    setMessages(session.messages);
    setHasDescribed(session.messages.length > 0);
    setActiveTab(null);
    setSessionId(session.id);
    setSessionName(session.name);
  }

  // Bug fix: deleting the session you're currently IN used to leave you
  // staring at a dead session. If the deleted id matches the active one,
  // fall through to the same reset a "New session" click does.
  function handleDeleteSession(id) {
    deleteSession(id);
    if (id === sessionId) handleSkip();
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-canvas">
      <div className="relative z-50 flex h-14 shrink-0 items-center border-b border-border bg-canvas/85 px-4 backdrop-blur-xl">
        <div className="flex flex-1 items-center">
          <Link
            to="/"
            className="flex items-center rounded-lg transition-opacity hover:opacity-80"
            aria-label="Go to home"
          >
            <Logo size={46} />
          </Link>
          <SessionDropdown
            sessionName={sessionName}
            onRename={handleRenameSession}
            canRename={messages.length > 0}
            sessions={sessions}
            onResume={handleResumeSession}
            onDelete={handleDeleteSession}
            onNewSession={handleSkip}
          />
        </div>

        <div className="flex flex-1 justify-center">
          <ApiKeyDropdown />
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <ProfileMenu
            totalDescribed={stats.totalDescribed}
            achievements={achievements}
          />
          <a
            href="https://github.com/tanujbishtt/ScreenSpeak"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-2.5 py-1.5 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-surface sm:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <GithubIcon size={14} />
            <span className="hidden sm:inline">Star</span>
          </a>
          <ThemeToggle className="text-slate-600 hover:bg-black/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" />
        </div>
      </div>

      <AchievementToast unlocked={newlyUnlocked} onDismiss={dismissUnlock} />

      {!currentImage ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          Loading a scene...
        </div>
      ) : isMobile ? (
        // MOBILE: one continuous scroll. Image is `sticky top-0` so it stays
        // visible right under the navbar while the rest scrolls underneath it,
        // shrinking a bit as you scroll (see the imageShrink scroll listener).
        <div
          ref={mobileScrollRef}
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          <div className="sticky top-0 z-10">
            <ImageMedia
              image={currentImage}
              onSkip={handleSkip}
              variant="sticky"
              isUploading={isUploadingImage}
              shrink={imageShrink}
            />
          </div>
          <div className="bg-surface-muted/70 p-5">
            <ImageReference
              image={currentImage}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onReferenceClick={handleReferenceClick}
              hasDescribed={hasDescribed}
              onUpload={handleUpload}
              onTemplateClick={handleTemplateClick}
            />
          </div>
          <ChatPanel
            variant="mobile"
            messages={messages}
            isThinking={isThinking}
            regeneratingId={regeneratingId}
            bottomRef={bottomRef}
            onSubmit={handleUserMessage}
            onRegenerate={handleRegenerate}
            tone={tone}
            setTone={setTone}
          />
        </div>
      ) : (
        // DESKTOP: original two-column layout, each side scrolls independently.
        <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
          <div className="flex w-1/2 flex-col border-r border-border bg-surface-muted/70">
            <div className="no-scrollbar flex-1 overflow-y-auto p-5">
              <ImageMedia
                image={currentImage}
                onSkip={handleSkip}
                variant="panel"
                isUploading={isUploadingImage}
              />
              <ImageReference
                image={currentImage}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onReferenceClick={handleReferenceClick}
                hasDescribed={hasDescribed}
                onUpload={handleUpload}
                onTemplateClick={handleTemplateClick}
              />
            </div>
          </div>
          <ChatPanel
            variant="desktop"
            messages={messages}
            isThinking={isThinking}
            regeneratingId={regeneratingId}
            bottomRef={bottomRef}
            onSubmit={handleUserMessage}
            onRegenerate={handleRegenerate}
            tone={tone}
            setTone={setTone}
          />
        </div>
      )}
    </div>
  );
}
