/**
 * Reusable wavy section divider — sits absolutely at the BOTTOM of a
 * section, filled with the color of the section that comes NEXT, so it
 * reads as that next color "rising up" into the current one. Same path
 * everywhere on purpose (per-page consistency); only `fill` changes.
 *
 * Path alternates up/down 8 times across the width — that's what makes
 * it read as an actual repeating wave instead of one big gentle curve.
 *
 * Usage: drop `<WaveDivider fill="fill-brut-teal" />` as the last child
 * inside a `relative` section, right before its closing tag.
 */
export default function WaveDivider({ fill = "fill-cream" }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 -mb-px overflow-hidden leading-[0]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="block h-20 w-full sm:h-28"
      >
        <path
          d="M0,50 C60,20 120,20 180,50 C240,80 300,80 360,50 C420,20 480,20 540,50 C600,80 660,80 720,50 C780,20 840,20 900,50 C960,80 1020,80 1080,50 C1140,20 1200,20 1260,50 C1320,80 1380,80 1440,50 L1440,100 L0,100 Z"
          className={fill}
        />
      </svg>
    </div>
  );
}