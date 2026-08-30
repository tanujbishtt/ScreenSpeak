import { useEffect, useState } from "react"
import { SkipForward } from "lucide-react"

const STICKY_MAX_HEIGHT = 176
const STICKY_MIN_HEIGHT = 112
const PANEL_LANDSCAPE_HEIGHT = 288
const PANEL_PORTRAIT_HEIGHT = 448

export default function ImageMedia({
  image,
  onSkip,
  variant = "panel",
  isUploading = false,
  shrink = 0,
}) {
  const isCurated = Boolean(image.vocab)
  const isSticky = variant === "sticky"

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
          ? "relative overflow-hidden bg-cream-panel transition-[height] duration-150 ease-out"
          : "relative mb-4 overflow-hidden rounded-2xl border-2 border-ink shadow-brutal transition-[height] duration-200 ease-out"
      }
      style={{ height: `${isSticky ? stickyHeight : panelHeight}px` }}
    >
      <img
        src={image.url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl brightness-75"
      />

      <img
        src={image.url}
        alt="Describe what's happening in this scene"
        onLoad={handleLoad}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/60 font-display text-sm font-medium text-cream backdrop-blur-sm">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
          Syncing image...
        </div>
      )}

      {isCurated && (
        <button
          onClick={onSkip}
          className="
            absolute right-3 top-3 flex h-8 w-8 items-center
            justify-center rounded-full border-2 border-ink bg-cream-surface text-ink
            shadow-brutal-sm transition-all hover:-translate-y-0.5
            active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
          "
          aria-label="Skip to next image"
        >
          <SkipForward size={15} />
        </button>
      )}
    </div>
  )
}