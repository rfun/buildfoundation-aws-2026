/**
 * Small display helpers shared by both quiz views.
 *
 * These lived in `mockSession.js` while the views were built against mock state
 * (Phase 1). That module is gone now that both roles run on the real channel, so
 * the genuinely reusable bits moved here.
 */

import { useEffect, useState } from 'react'

/**
 * Remaining whole seconds until `endsAt`, or null when no timer is running.
 *
 * `endsAt` must already be expressed on THIS client's clock. The participant
 * gets that from `state.localEndsAt` — `useQuizChannel` rebases the presenter's
 * deadline onto the receiver's clock using the `at` stamp on the `state`
 * message, so a phone whose clock is two minutes off still counts down 45
 * seconds (plan risk register: "Clock skew breaks countdown").
 *
 * The immediate first tick matters. Without it, `now` is whatever it was when
 * the component last rendered — on the participant view that is the lobby,
 * possibly minutes earlier — and the first frame of every question shows a
 * countdown computed against a stale clock. It read "0:46" on a 45-second timer.
 */
export function useCountdown(endsAt) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!endsAt) return undefined
    const update = () => setNow(Date.now())
    // Deferred by a tick rather than called inline: setting state synchronously
    // in an effect body cascades an extra render (and eslint rejects it).
    const first = setTimeout(update, 0)
    const id = setInterval(update, 250)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [endsAt])
  if (!endsAt) return null
  return Math.max(0, Math.round((endsAt - now) / 1000))
}

export function formatClock(seconds) {
  if (seconds === null) return '—'
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

/** A, B, C… for an option index. */
export function optionLetter(index) {
  return String.fromCharCode(65 + index)
}
