import { Link } from "react-router-dom";

const VARIANTS = {
  yellow: "bg-brut-yellow text-ink",
  orange: "bg-brut-orange text-white",
  teal: "bg-brut-teal text-ink",
  white: "bg-cream-surface text-ink",
  ink: "bg-ink text-cream",
};

const SIZES = {
  md: "px-6 py-2.5 text-[15px]",
  lg: "px-8 py-3.5 text-base",
};

/**
 * Brutalist button primitive — solid fill, black border, hard offset
 * shadow. Renders as a react-router <Link> when `to` is passed, a plain
 * <a> when `href` is passed, otherwise a real <button>.
 *
 * variant: "yellow" | "orange" | "teal" | "white" | "ink"
 * size: "md" | "lg"
 */
export default function Button({
  children,
  variant = "yellow",
  size = "md",
  to,
  href,
  className = "",
  ...props
}) {
  const classes = `
    inline-flex items-center justify-center gap-2
    rounded-2xl border-2 border-ink
    font-display font-semibold
    shadow-brutal
    transition-all duration-150 ease-out
    hover:-translate-y-0.5 hover:shadow-brutal-lg
    active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
    ${VARIANTS[variant]}
    ${SIZES[size]}
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}