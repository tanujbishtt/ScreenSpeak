/**
 * Brutalist pill badge — black border, small hard shadow. Used for the
 * floating tags near the hero image ("nice vocab", "quick fix" style) and
 * any small status/label chip.
 */
export default function Badge({ children, className = "", ...props }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full border-2 border-ink bg-cream-surface
        px-4 py-1
        font-display text-sm font-medium text-ink
        shadow-brutal-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}