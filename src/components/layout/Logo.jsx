export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <rect width="140" height="140" rx="32" fill="#2563eb" />
      <rect x="28" y="38" width="84" height="60" rx="16" fill="white" />
      <path d="M38 98 L28 118 L50 98 Z" fill="white" />
      <ellipse cx="70" cy="68" rx="18" ry="11" fill="#2563eb" />
      <circle cx="70" cy="68" r="6" fill="#1e3a8a" />
      <circle cx="73" cy="65" r="2" fill="white" />
    </svg>
  )
}