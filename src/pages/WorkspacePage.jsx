import { useEffect, useRef, useState } from "react";
import { BookOpen, Lightbulb, Moon, SkipForward, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { images } from "../data/images";
import { promptTemplates } from "../data/promptTemplates";
import ChatBubble from "../components/workspace/ChatBubble";
import ChatInput from "../components/workspace/ChatInput";
import SessionDropdown from "../components/workspace/SessionDropdown";
import Logo from "../components/layout/Logo";
import { GithubIcon } from "../components/icons/BrandIcons";
import { useTheme } from "../context/ThemeContext";
import ApiKeyDropdown from "../components/workspace/ApiKeyDropdown";
import { askAI } from "../lib/ai";
import { useAiSettings } from "../hooks/useAiSettings";
import TypingIndicator from "../components/workspace/TypingIndicator";

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

export default function WorkspacePage() {
  const { theme, toggleTheme } = useTheme();
  const [currentImage, setCurrentImage] = useState(getRandomImage);
  const [messages, setMessages] = useState([]);
  const [hasDescribed, setHasDescribed] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const bottomRef = useRef(null);
  const { provider, apiKey } = useAiSettings();
  const [isThinking, setIsThinking] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function addMessage(message) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        ...message,
      },
    ]);
  }

  async function callAI(content, extra = {}) {
    const newHistory = [...messages, { role: "user", content }];
    addMessage({ role: "user", content, ...extra });

    setIsThinking(true);
    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
      });
      addMessage({ role: "assistant", content: reply, canRegenerate: true });
    } catch (err) {
      addMessage({
        role: "assistant",
        content: `Something went wrong: ${err.message}`,
      });
    } finally {
      setIsThinking(false);
    }
  }

  async function handleRegenerate(messageId) {
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) return;

    const historyBefore = messages.slice(0, index);
    setRegeneratingId(messageId);

    try {
      const reply = await askAI(provider, {
        apiKey,
        imageUrl: currentImage.url,
        history: historyBefore.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: reply } : m)),
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: `Something went wrong: ${err.message}` }
            : m,
        ),
      );
    } finally {
      setRegeneratingId(null);
    }
  }

  function handleUserMessage(text) {
    if (!hasDescribed) setHasDescribed(true);
    callAI(text);
  }

  function handleTemplateClick(template) {
    callAI(template.prompt, { isTemplate: true, displayLabel: template.label });
  }

  function handleNextImage() {
    setCurrentImage(getRandomImage());
    setMessages([]);
    setHasDescribed(false);
    setActiveTab(null);
  }

  const tabButtonClass = (tab) =>
    `px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === tab
        ? "border-primary text-primary"
        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
    }`;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-canvas">
      {/* Toolbar */}
      <div className="relative z-50 flex h-14 shrink-0 items-center border-b border-border bg-canvas/85 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-1">
          <Link
            to="/"
            className="flex items-center rounded-lg transition-opacity hover:opacity-80"
            aria-label="Go to home"
          >
            <Logo size={22} />
          </Link>
          <SessionDropdown />
        </div>

        <div className="flex-1 flex justify-center">
          <ApiKeyDropdown />
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <a
            href="https://github.com/tanujbishtt/ScreenSpeak"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-sm text-slate-600 transition hover:border-slate-400 hover:bg-surface dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <GithubIcon size={14} />
            Star
          </a>
          <button
            onClick={toggleTheme}
            className="text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Workspace panels */}
      <div className="flex min-h-0 flex-1">
        {/* Image panel */}
        <div
          className="
            flex min-h-0 w-1/2 flex-col border-r border-border
            bg-surface-muted/70
          "
        >
          <div className="no-scrollbar flex-1 overflow-y-auto p-5">
            <div className="relative mb-4">
              <img
                src={currentImage.url}
                alt="Describe what's happening in this scene"
                className="
                  h-72 w-full rounded-2xl object-cover
                  shadow-[0_8px_25px_rgba(50,40,20,0.10)]
                  dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]
                "
              />

              <span
                className="
                  absolute left-3 top-3 rounded-full bg-slate-900/65
                  px-3 py-1 text-xs font-medium capitalize text-white
                  backdrop-blur-md
                "
              >
                {currentImage.category}
              </span>

              <button
                onClick={handleNextImage}
                className="
                  absolute right-3 top-3 flex h-8 w-8 items-center
                  justify-center rounded-full bg-slate-900/65 text-white
                  backdrop-blur-md transition hover:bg-slate-900/85
                "
                aria-label="Skip to next image"
              >
                <SkipForward size={15} />
              </button>
            </div>

            {/* Learning tools */}
            <div className="mb-4 flex items-center gap-4 border-b border-border">
              <button
                onClick={() =>
                  setActiveTab(activeTab === "vocab" ? null : "vocab")
                }
                className={tabButtonClass("vocab")}
              >
                <span className="flex items-center gap-1.5">
                  <BookOpen size={14} />
                  Vocab
                </span>
              </button>

              <button
                onClick={() =>
                  setActiveTab(activeTab === "solution" ? null : "solution")
                }
                className={tabButtonClass("solution")}
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb size={14} />
                  Solution
                </span>
              </button>
            </div>

            {activeTab === "vocab" && (
              <div className="mb-4 flex flex-col gap-2">
                {currentImage.vocab.map((vocab) => (
                  <div key={vocab.word} className="text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {vocab.word}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      {" "}
                      — {vocab.meaning}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "solution" && (
              <div className="mb-4 text-sm text-slate-700 dark:text-slate-300">
                {currentImage.solution}
              </div>
            )}

            {hasDescribed && (
              <div className="flex flex-wrap gap-2 pt-2">
                {promptTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className="
                      rounded-full border border-border bg-surface/70
                      px-4 py-1.5 text-sm font-medium text-slate-600
                      shadow-sm transition-all hover:scale-105
                      hover:border-slate-400 hover:bg-surface
                      dark:border-white/10 dark:bg-white/5 dark:text-slate-300
                      dark:hover:bg-white/10
                    "
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex min-h-0 w-1/2 flex-col bg-surface/70">
          <div
            className="
              border-b border-border bg-surface/50 px-5 py-2.5
              text-sm font-medium text-slate-700 dark:text-slate-300
            "
          >
            Chat
          </div>

          {messages.length === 0 ? (
            <div
              className="
                flex min-h-0 flex-1 flex-col items-center justify-center
                px-6 text-center
              "
            >
              <Logo size={28} />

              <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                Describe what's happening in the photo to start practicing —
                I'll give you feedback right here.
              </p>
            </div>
          ) : (
            <div className="no-scrollbar flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-y-auto p-5">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message}
                  onRegenerate={() => handleRegenerate(message.id)}
                  isRegenerating={regeneratingId === message.id}
                />
              ))}
              {isThinking && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}

          <div
            className="
              border-t border-border bg-canvas/55 p-4 backdrop-blur-xl
            "
          >
            <ChatInput onSubmit={handleUserMessage} disabled={isThinking} />
          </div>
        </div>
      </div>
    </div>
  );
}
