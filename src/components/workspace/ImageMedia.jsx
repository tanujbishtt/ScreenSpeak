import { SkipForward, CloudUpload } from "lucide-react"

// props:
//   image      - current image object
//   onSkip     - curated-only "next image" action
//   variant    - "sticky" (compact mobile header) or "panel" (desktop card)
//   isUploading - true while an uploaded image is still saving to Storage
export default function ImageMedia({ image, onSkip, variant = "panel", isUploading = false }) {
  const isCurated = Boolean(image.vocab)
  const isSticky = variant === "sticky"

  return (
    <div
      className={
        isSticky
          ? "relative bg-canvas"
          : "relative mb-4"
      }
    >
      <img
        src={image.url}
        alt="Describe what's happening in this scene"
        className={
          isSticky
            ? "h-44 w-full object-cover"
            : "h-72 w-full rounded-2xl object-cover shadow-[0_8px_25px_rgba(50,40,20,0.10)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
        }
      />

      {isCurated && (
        <span
          className="
            absolute left-3 top-3 rounded-full bg-slate-900/65
            px-3 py-1 text-xs font-medium capitalize text-white
            backdrop-blur-md
          "
        >
          {image.category}
        </span>
      )}

      {isCurated && (
        <button
          onClick={onSkip}
          className="
            absolute right-3 top-3 flex h-8 w-8 items-center
            justify-center rounded-full bg-slate-900/65 text-white
            backdrop-blur-md transition hover:bg-slate-900/85
          "
          aria-label="Skip to next image"
        >
          <SkipForward size={15} />
        </button>
      )}

      {isUploading && (
        <span
          className="
            absolute left-3 top-3 flex items-center gap-1.5 rounded-full
            bg-slate-900/65 px-3 py-1 text-xs font-medium text-white
            backdrop-blur-md
          "
        >
          <CloudUpload size={12} className="animate-pulse" />
          Saving to cloud...
        </span>
      )}
    </div>
  )
}