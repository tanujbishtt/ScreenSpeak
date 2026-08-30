const ROTATE = {
  none: "",
  left: "-rotate-2",
  right: "rotate-2",
};

/**
 * Brutalist card primitive — white surface, black border, hard offset
 * shadow. `rotate` gives the sticky-note tilt used for testimonial-style
 * cards in the inspo; leave it "none" for regular grid cards.
 */
export default function Card({
  children,
  rotate = "none",
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl border-2 border-ink bg-cream-surface
        shadow-brutal
        transition-all duration-200 hover:-translate-y-1 hover:shadow-brutal-lg
        ${ROTATE[rotate]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}