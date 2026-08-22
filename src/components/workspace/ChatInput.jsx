import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function ChatInput({ onSubmit, disabled }) {
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)

  // Grow with content while keeping a maximum height. This is the only
  // "dynamic sizing" left — the box itself no longer changes WIDTH on
  // focus like before, just its height as you type more lines.
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [value])

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
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
        rounded-2xl border border-slate-200/60
        bg-white/60 backdrop-blur-3xl
        shadow-[0_10px_35px_rgba(0,0,0,0.08)]
        transition-shadow
        focus-within:shadow-[0_15px_45px_rgba(0,0,0,0.14)]
        dark:border-white/10 dark:bg-white/5
        dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)]
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
          text-[15px] leading-6 text-slate-900
          outline-none
          placeholder:text-slate-400
          dark:text-white dark:placeholder:text-slate-500
        "
        style={{ maxHeight: "140px" }}
      />

      <button
        disabled={!value.trim() || disabled}
        onClick={submit}
        className="
          m-2 flex h-9 w-9 shrink-0
          items-center justify-center rounded-full
          bg-primary text-primary-foreground
          shadow-md transition-transform
          hover:scale-105 active:scale-95
          disabled:pointer-events-none disabled:opacity-40
        "
        aria-label="Send message"
      >
        <ArrowUp size={17} />
      </button>
    </div>
  )
}