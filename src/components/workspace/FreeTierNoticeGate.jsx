import { useState } from "react"
import FreeTierNotice from "./FreeTierNotice"

const FREE_TIER_NOTICE_KEY = "scenespeak_free_tier_notice_seen"
export default function FreeTierNoticeGate() {
  const [dismissed, setDismissed] = useState(
    () => Boolean(sessionStorage.getItem(FREE_TIER_NOTICE_KEY))
  )

  if (dismissed) return null

  function handleDismiss() {
    sessionStorage.setItem(FREE_TIER_NOTICE_KEY, "1")
    setDismissed(true)
  }

  return <FreeTierNotice onDismiss={handleDismiss} />
}
