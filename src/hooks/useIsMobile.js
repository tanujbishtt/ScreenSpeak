import { useEffect, useState } from "react"

// Mirrors Tailwind's `md` breakpoint (768px). We use this to render two
// STRUCTURALLY different layouts in WorkspacePage instead of hiding/showing
// the same DOM with CSS — that would mean two <img> tags in the page at
// once (one hidden), which wastes a network fetch. Only one layout mounts
// at a time with this approach.
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  )

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    function handleChange(event) {
      setIsMobile(event.matches)
    }
    mql.addEventListener("change", handleChange)
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  return isMobile
}