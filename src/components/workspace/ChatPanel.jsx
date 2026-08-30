import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"
import TypingIndicator from "./TypingIndicator"
import ToneToggle from "./ToneToggle"
import Logo from "../layout/Logo"

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
    <div className={isMobile ? "flex flex-1 flex-col" : "flex min-h-0 w-1/2 flex-col bg-cream-panel"}>
      <div
        className={`flex items-center border-b-2 border-ink bg-cream-panel px-5 py-2.5 ${
          isMobile ? "justify-end" : "justify-between"
        }`}
      >
        {!isMobile && (
          <span className="font-display text-sm font-semibold text-ink">Chat</span>
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
          <Logo size={70} />
          <p className="max-w-xs text-sm text-ink-muted">
            Describe what's happening in the photo to start practicing — I'll give you feedback
            right here.
          </p>
        </div>
      ) : isMobile ? (
        <div className="flex flex-1 flex-col justify-end gap-4 p-5">
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
      ) : (
        <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
          <div className="mt-auto flex flex-col gap-4">
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
        </div>
      )}

      <div
        className={
          isMobile
            ? "sticky bottom-0 border-t-2 border-ink bg-cream-panel p-3"
            : "border-t-2 border-ink bg-cream-panel p-4"
        }
      >
        <ChatInput onSubmit={onSubmit} disabled={isThinking} />
      </div>
    </div>
  )
}