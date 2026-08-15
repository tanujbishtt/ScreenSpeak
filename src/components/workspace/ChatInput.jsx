import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ChatInput({ onSubmit }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef(null);

  // Grow with content while keeping a maximum height.
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();

    if (!text) return;

    onSubmit(text);
    setValue("");
    setIsFocused(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div
      className={`
        mx-auto
        transition-all duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        ${isFocused ? "max-w-5xl" : "max-w-md"}
      `}
    >
      <div
        className={`
          relative flex items-end
          rounded-full border
          border-slate-200/60
          bg-white/60
          backdrop-blur-3xl
          shadow-[0_10px_35px_rgba(0,0,0,0.10)]
          transition-all duration-500
          hover:shadow-[0_15px_45px_rgba(0,0,0,0.15)]
          dark:border-white/10
          dark:bg-white/5
          dark:shadow-[0_10px_35px_rgba(0,0,0,0.45)]
          ${isFocused ? "rounded-[28px]" : ""}
        `}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!value.trim()) setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Describe what you see..."
          className="
            w-full resize-none
            overflow-y-auto
            bg-transparent
            px-4 py-5
            text-[15px] leading-6
            text-slate-900
            outline-none
            placeholder:text-slate-400
            scrollbar-none
            [&::-webkit-scrollbar]:hidden
            dark:text-white
            dark:placeholder:text-slate-500
          "
          style={{ maxHeight: "180px" }}
        />

        <button
          onClick={submit}
          disabled={!value.trim()}
          className={`
            mb-3 mr-5
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-lg
            transition-all duration-300
            hover:scale-105
            active:scale-95
            disabled:pointer-events-none
            disabled:opacity-50
            ${
              isFocused || value
                ? "translate-x-0 opacity-100"
                : "pointer-events-none translate-x-2 opacity-0"
            }
          `}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}