export default function GrainOverlay() {
  return (
    <svg className="fixed inset-0 -z-10 h-full w-full opacity-[0.035] dark:opacity-[0.06] mix-blend-overlay pointer-events-none">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  )
}