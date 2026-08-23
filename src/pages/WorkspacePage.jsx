import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { curatedImages } from "../data/curatedImages"
import ImageMedia from "../components/workspace/ImageMedia"
import ImageReference from "../components/workspace/ImageReference"
import ChatPanel from "../components/workspace/ChatPanel"
import SessionDropdown from "../components/workspace/SessionDropdown"
import Logo from "../components/layout/Logo"
import { GithubIcon } from "../components/icons/BrandIcons"
import ThemeToggle from "../components/layout/ThemeToggle"
import ApiKeyDropdown from "../components/workspace/ApiKeyDropdown"
import ProfileMenu from "../components/workspace/ProfileMenu"
import { askAI } from "../lib/ai"
import { useAiSettings } from "../hooks/useAiSettings"
import { useSessions } from "../hooks/useSessions"
import { useIsMobile } from "../hooks/useIsMobile"
import { fileToObjectUrl, revokeObjectUrl } from "../lib/fileToObjectUrl"
import { useAchievements } from "../hooks/useAchievements"
import AchievementToast from "../components/workspace/AchievementToast"

function getRandomCuratedImage() {
  return curatedImages[Math.floor(Math.random() * curatedImages.length)]
}

export default function WorkspacePage() {
  const { provider, apiKey } = useAiSettings()
  const { sessions, upsertSession, deleteSession } = useSessions()
  const isMobile = useIsMobile()
  const {
    stats,
    achievements,
    newlyUnlocked,
    recordScore,
    recordReferenceView,
    dismissUnlock,
  } = useAchievements()

  const [currentImage, setCurrentImage] = useState(getRandomCuratedImage)
  const [messages, setMessages] = useState([])
  const [hasDescribed, setHasDescribed] = useState(false)
  const [activeTab, setActiveTab] = useState(null)
  const [isThinking, setIsThinking] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState(null)

  const [sessionId, setSessionId] = useState(null)
  const [sessionName, setSessionName] = useState("Untitled")

  const bottomRef = useRef(null)
  const uploadedUrlRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!sessionId) return
    upsertSession({ id: sessionId, name: sessionName, image: currentImage, messages })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  useEffect(() => {
    return () => revokeObjectUrl(uploadedUrlRef.current)
  }, [])

  function resetForNewImage(image) {
    setCurrentImage(image)
    setMessages([])
    setHasDescribed(false)
    setActiveTab(null)
    setSessionId(null)
    setSessionName("Untitled")
  }

  function handleSkip() {
    revokeObjectUrl(uploadedUrlRef.current)
    uploadedUrlRef.current = null
    resetForNewImage(getRandomCuratedImage())
  }

  function handleUpload(file) {
    revokeObjectUrl(uploadedUrlRef.current)
    const url = fileToObjectUrl(file)
    uploadedUrlRef.current = url
    resetForNewImage({ id: `uploaded-${Date.now()}`, url })
  }

  function addMessage(message) {
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), ...message }])
  }

  async function callAI(content, extra = {}, requestScore = false) {
    const newHistory = [...messages, { role: "user", content }]
    addMessage({ role: "user", content, ...extra })

    setIsThinking(true)
    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
        requestScore,
      })
      addMessage({ role: "assistant", content: reply.text, score: reply.score, canRegenerate: true })

      // Achievements only count the FIRST scored attempt on an image —
      // never on regenerate (see handleRegenerate), so streaks can't be farmed.
      if (requestScore && typeof reply.score === "number") recordScore(reply.score)
    } catch (err) {
      addMessage({ role: "assistant", content: `Something went wrong: ${err.message}` })
    } finally {
      setIsThinking(false)
    }
  }

  async function handleRegenerate(messageId) {
    const index = messages.findIndex((m) => m.id === messageId)
    if (index === -1) return

    const historyBefore = messages.slice(0, index)
    const requestScore = index === 1 // the very first assistant reply is the only scored one
    setRegeneratingId(messageId)

    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: historyBefore.map((m) => ({ role: m.role, content: m.content })),
        requestScore,
      })
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: reply.text, score: reply.score } : m)),
      )
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: `Something went wrong: ${err.message}` } : m,
        ),
      )
    } finally {
      setRegeneratingId(null)
    }
  }

  function handleUserMessage(text) {
    const isFirstAttempt = !hasDescribed
    if (isFirstAttempt) setHasDescribed(true)
    callAI(text, {}, isFirstAttempt)
  }

  function handleTemplateClick(template) {
    callAI(template.prompt, { isTemplate: true, displayLabel: template.label })
  }

  // Wraps setActiveTab so opening the Native/Gen-Z reference tab also
  // counts toward the "Native Curious" achievement — ImageReference.jsx
  // itself needs zero changes, it just calls whatever setter it's given.
  function handleSetActiveTab(next) {
    setActiveTab(next)
    if (next === "reference") recordReferenceView()
  }

  function handleRenameSession(newName) {
    setSessionName(newName)
    const saved = upsertSession({ id: sessionId, name: newName, image: currentImage, messages })
    setSessionId(saved.id)
  }

  function handleResumeSession(session) {
    setCurrentImage(session.image)
    setMessages(session.messages)
    setHasDescribed(session.messages.length > 0)
    setActiveTab(null)
    setSessionId(session.id)
    setSessionName(session.name)
  }

  // Bug fix: deleting the session you're currently IN used to leave you
  // staring at a dead session. If the deleted id matches the active one,
  // fall through to the same reset a "New session" click does.
  function handleDeleteSession(id) {
    deleteSession(id)
    if (id === sessionId) handleSkip()
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-canvas">
      <div className="relative z-50 flex h-14 shrink-0 items-center border-b border-border bg-canvas/85 px-4 backdrop-blur-xl">
        <div className="flex flex-1 items-center gap-3">
          <Link to="/" className="flex items-center rounded-lg transition-opacity hover:opacity-80" aria-label="Go to home">
            <Logo size={22} />
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
          <ProfileMenu totalDescribed={stats.totalDescribed} achievements={achievements} />
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

      {isMobile ? (
        // MOBILE: one continuous scroll. Image is `sticky top-0` so it stays
        // visible right under the navbar while the rest scrolls underneath it.
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-10">
            <ImageMedia image={currentImage} onSkip={handleSkip} variant="sticky" />
          </div>
          <div className="bg-surface-muted/70 p-5">
            <ImageReference
              image={currentImage}
              activeTab={activeTab}
              setActiveTab={handleSetActiveTab}
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
          />
        </div>
      ) : (
        // DESKTOP: original two-column layout, each side scrolls independently.
        <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
          <div className="flex w-1/2 flex-col border-r border-border bg-surface-muted/70">
            <div className="no-scrollbar flex-1 overflow-y-auto p-5">
              <ImageMedia image={currentImage} onSkip={handleSkip} variant="panel" />
              <ImageReference
                image={currentImage}
                activeTab={activeTab}
                setActiveTab={handleSetActiveTab}
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
          />
        </div>
      )}
    </div>
  )
}