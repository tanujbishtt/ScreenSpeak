import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"
import TypingIndicator from "./TypingIndicator"
import ToneToggle from "./ToneToggle"
import Logo from "../layout/Logo"

// props:
//   messages, isThinking, regeneratingId, bottomRef, onSubmit, onRegenerate
//   tone, setTone - from useTonePreference()
//   variant - "desktop" (own bounded scroll region, right-hand column) or
//             "mobile" (joins the page's single scroll, input stays sticky
//             at the bottom of the viewport instead of the panel)
export default function ChatPanel({
  messages,
  isThinking,
  regeneratingId,
  bottomRef,
  onSubmit,
  onRegenerate,
  tone,
  setTone,
  variant = "desktop",
}) {
  const isMobile = variant === "mobile"

  return (
    <div className={isMobile ? "flex flex-1 flex-col" : "flex min-h-0 w-1/2 flex-col bg-surface/70"}>
      <div
        className={`flex items-center border-b border-border bg-surface/50 px-5 py-2.5 ${
          isMobile ? "justify-end" : "justify-between"
        }`}
      >
        {!isMobile && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Chat</span>
        )}
        <ToneToggle tone={tone} setTone={setTone} />
      </div>

      {messages.length === 0 ? (
        <div
          className={
            isMobile
              ? "flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
              : "flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"
          }
        >
          <Logo size={28} />
          <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Describe what's happening in the photo to start practicing — I'll give you feedback
            right here.
          </p>
        </div>
      ) : (
        <div
          className={
            isMobile
              ? "flex flex-1 flex-col justify-end gap-4 p-5"
              : "no-scrollbar flex min-h-0 flex-1 flex-col justify-end gap-4 overflow-y-auto p-5"
          }
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              onRegenerate={() => onRegenerate(message.id)}
              isRegenerating={regeneratingId === message.id}
            />
          ))}
          {isThinking && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      <div
        className={
          isMobile
            ? "sticky bottom-0 border-t border-border bg-canvas/90 p-3 backdrop-blur-xl"
            : "border-t border-border bg-canvas/55 p-4 backdrop-blur-xl"
        }
      >
        <ChatInput onSubmit={onSubmit} disabled={isThinking} />
      </div>
    </div>
  )
}