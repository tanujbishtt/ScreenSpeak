import { RotateCcw } from "lucide-react";

import Logo from "../layout/Logo";

export default function ChatBubble({ message, onRegenerate }) {
  const { role, content, isTemplate, canRegenerate } = message;

  if (role === "user" && isTemplate) {
    return (
      <div className="flex justify-end">
        <div
          className="
            rounded-full
            border border-primary/20
            bg-primary/10
            px-4 py-1.5
            text-sm font-medium text-primary
          "
        >
          {content}
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
            className="
              mt-2
              flex items-center gap-1.5
              text-xs
              text-slate-500
              transition
              hover:text-slate-800
              dark:text-slate-400
              dark:hover:text-primary-foreground
            "
          >
            <RotateCcw size={12} />
            Try another
          </button>
        )}
      </div>
    </div>
  );
}