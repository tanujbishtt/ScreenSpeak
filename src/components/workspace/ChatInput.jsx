import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"
import { playWhoosh } from "../../lib/sound"

export default function ChatInput({ onSubmit, disabled }) {
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [value])

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
    playWhoosh()
    onSubmit(text)
    setValue("")
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div
      className="
        relative flex w-full items-end
        rounded-2xl border-2 border-ink
        bg-cream-surface
        shadow-brutal
        transition-all
        focus-within:shadow-brutal-lg
      "
    >
      <textarea
        disabled={disabled}
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Describe what you see..."
        className="
          no-scrollbar w-full resize-none
          bg-transparent px-4 py-3.5
          text-[15px] leading-6 text-ink
          outline-none
          placeholder:text-ink-muted
        "
        style={{ maxHeight: "140px" }}
      />

      <button
        disabled={!value.trim() || disabled}
        onClick={submit}
        className="
          m-2 flex h-9 w-9 shrink-0
          items-center justify-center rounded-full
          border-2 border-ink bg-ink text-cream
          shadow-brutal-sm transition-all
          hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          disabled:pointer-events-none disabled:opacity-40
        "
        aria-label="Send message"
      >
        <ArrowUp size={17} />
      </button>
    </div>
  )
}