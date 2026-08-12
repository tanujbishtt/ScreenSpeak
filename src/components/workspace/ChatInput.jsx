import { useState } from "react";
import { Image, ArrowUp } from "lucide-react";

export default function ChatInput({ onSubmit }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function submit() {
    if (!value.trim()) return;

    onSubmit(value.trim());
    setValue("");
    setIsFocused(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div
      className={`
        mx-auto
        transition-all
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]
        ${isFocused ? "max-w-5xl" : "max-w-md"}
      `}
    >
      <div
        className={`
          relative
          flex
          items-center
          rounded-full
          border
          transition-all
          duration-500
          backdrop-blur-3xl
          bg-white/60
          dark:bg-white/5
          border-slate-200/60
          dark:border-white/10
          shadow-[0_10px_35px_rgba(0,0,0,0.10)]
          dark:shadow-[0_10px_35px_rgba(0,0,0,0.45)]
          hover:shadow-[0_15px_45px_rgba(0,0,0,0.15)]
          ${isFocused ? "rounded-[28px]" : ""}
        `}
      >
        {/* Left Icon */}
        <Image
          size={20}
          className="ml-5 shrink-0 text-slate-400 dark:text-slate-500"
        />

        {/* Input */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!value) setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Describe what you see..."
          className="
            w-full
            resize-none
            bg-transparent
            px-4
            py-5
            text-[15px]
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            dark:placeholder:text-slate-500
            outline-none
          "
        />

        {/* Send Button */}
        <button
          onClick={submit}
          className={`
            mr-3
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            hover:bg-blue-500
            active:scale-95

            ${
              isFocused || value
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2 pointer-events-none"
            }
          `}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
