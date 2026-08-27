import { SkipForward } from "lucide-react"

const STICKY_MAX_HEIGHT = 176 // px, matches the old fixed h-44
const STICKY_MIN_HEIGHT = 112 // px, floor once fully scrolled/shrunk

// props:
//   image       - current image object
//   onSkip      - curated-only "next image" action
//   variant     - "sticky" (compact mobile header) or "panel" (desktop card)
//   isUploading - true while the picked file is syncing to Cloudinary
//   shrink      - 0-64px, how much to shave off the sticky header's height as
//                 the mobile page scrolls (ignored for the "panel" variant)
export default function ImageMedia({
  image,
  onSkip,
  variant = "panel",
  isUploading = false,
  shrink = 0,
}) {
  const isCurated = Boolean(image.vocab)
  const isSticky = variant === "sticky"

  const stickyHeight = STICKY_MAX_HEIGHT - Math.min(shrink, STICKY_MAX_HEIGHT - STICKY_MIN_HEIGHT)

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
        style={isSticky ? { height: `${stickyHeight}px` } : undefined}
        className={
          isSticky
            ? "w-full object-cover transition-[height] duration-150 ease-out"
            : "h-72 w-full rounded-2xl object-cover shadow-[0_8px_25px_rgba(50,40,20,0.10)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
        }
      />

      {isUploading && (
        <div
          className={
            "absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/50 text-sm font-medium text-white backdrop-blur-sm " +
            (isSticky ? "" : "rounded-2xl")
          }
        >
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Syncing image...
        </div>
      )}

      {isCurated && (
        <button
          onClick={onSkip}
          className="
            absolute right-3 top-3 flex h-8 w-8 items-center
            justify-center rounded-full bg-slate-900/65 text-white
            backdrop-blur-md transition-transform hover:bg-slate-900/85
            active:scale-90
          "
          aria-label="Skip to next image"
        >
          <SkipForward size={15} />
        </button>
      )}
    </div>
  )
}