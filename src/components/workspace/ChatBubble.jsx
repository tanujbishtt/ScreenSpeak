import { RotateCcw } from "lucide-react";

import Logo from "../layout/Logo";

export default function ChatBubble({ message, onRegenerate, isRegenerating }){
  const { role, content, isTemplate, displayLabel, canRegenerate } = message;

  if (role === "user" && isTemplate) {
    return (
      <div className="flex justify-end">
        <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {displayLabel}
        </div>
      </div>
    );
  }

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="
            max-w-[75%]
            rounded-2xl rounded-br-md
            bg-primary
            px-4 py-3
            text-[15px] leading-6
            text-primary-foreground
          "
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5">
      <div className="mt-1 shrink-0">
        <Logo size={40} />
      </div>

      <div
        className="
          max-w-[75%]
          rounded-2xl rounded-bl-md
          border border-slate-200/60
          bg-white/60
          px-4 py-3
          text-[15px] leading-6
          text-slate-800
          backdrop-blur-xl
          dark:border-white/10
          dark:bg-white/5
          dark:text-slate-200
        "
      >
        {content}
        {canRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-primary-foreground transition disabled:opacity-50"
          >
            <RotateCcw
              size={12}
              className={isRegenerating ? "animate-spin" : ""}
            />
            {isRegenerating ? "Regenerating..." : "Try another"}
          </button>
        )}
      </div>
    </div>
  );
}
