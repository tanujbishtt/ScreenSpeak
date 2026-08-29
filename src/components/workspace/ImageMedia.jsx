import { useEffect, useState } from "react"
import { SkipForward } from "lucide-react"

const STICKY_MAX_HEIGHT = 176 // px, matches the old fixed h-44
const STICKY_MIN_HEIGHT = 112 // px, floor once fully scrolled/shrunk
const PANEL_LANDSCAPE_HEIGHT = 288 // px, same as the old fixed h-72
const PANEL_PORTRAIT_HEIGHT = 448 // px, taller box for vertical images —
// safe on desktop since this side panel already scrolls independently

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

  // We don't store width/height in Firestore, so orientation is only known
  // once the image itself finishes loading in the browser. Starts false
  // (landscape preset) and flips once measured — only affects the desktop
  // panel's height, the sticky header's range never changes.
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    setIsPortrait(false)
  }, [image.url])

  function handleLoad(e) {
    setIsPortrait(e.target.naturalHeight > e.target.naturalWidth)
  }

  const stickyHeight = STICKY_MAX_HEIGHT - Math.min(shrink, STICKY_MAX_HEIGHT - STICKY_MIN_HEIGHT)
  const panelHeight = isPortrait ? PANEL_PORTRAIT_HEIGHT : PANEL_LANDSCAPE_HEIGHT

  return (
    <div
      className={
        isSticky
          ? "relative overflow-hidden bg-canvas transition-[height] duration-150 ease-out"
          : "relative mb-4 overflow-hidden rounded-2xl shadow-[0_8px_25px_rgba(50,40,20,0.10)] transition-[height] duration-200 ease-out dark:shadow-[0_8px_25px_rgba(0,0,0,0.25)]"
      }
      style={{ height: `${isSticky ? stickyHeight : panelHeight}px` }}
    >
      {/* Blurred backdrop fills the box regardless of the image's aspect
          ratio, so landscape and portrait images both look intentional
          instead of harshly cropped or leaving empty bars. */}
      <img
        src={image.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-75"
      />

      {/* The real image — always shown in full, never cropped. */}
      <img
        src={image.url}
        alt="Describe what's happening in this scene"
        onLoad={handleLoad}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/50 text-sm font-medium text-white backdrop-blur-sm">
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