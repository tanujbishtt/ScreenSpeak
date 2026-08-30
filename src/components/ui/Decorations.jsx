export function Sparkle({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 1.5c.6 4.6 1.9 6.9 6.5 7.5-4.6.6-5.9 2.9-6.5 7.5-.6-4.6-1.9-6.9-6.5-7.5 4.6-.6 5.9-2.9 6.5-7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DottedPlus({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 2v6M10 12v6M2 10h6M12 10h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Dot({ size = 10, className = "" }) {
  return (
    <span
      className={`inline-block rounded-full bg-current ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}