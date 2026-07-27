/**
 * Room code derivation (spec §8).
 *
 * The 4-digit code is a hash of `passphrase + session nonce`, not a random
 * number. The nonce is what makes two presenters running the same passphrase at
 * the same time land in different rooms (spec §9); the passphrase is what stops a
 * third party who guesses a code from being able to *predict* the room another
 * presenter will open.
 *
 * To be blunt about what this is worth: on a static site the derivation runs in
 * code the attacker can read, so it is a speed bump, not a guarantee. See spec §8.
 *
 * The nonce is kept in `sessionStorage`, so an accidental refresh re-derives the
 * SAME code and the room the class already joined stays alive (spec §7.4).
 * "New session" clears it and a fresh code is derived.
 */

/**
 * Placeholder until Phase 5 chooses the real passphrase and gates
 * `/quiz/present` on it. Phase 5 replaces this with the passphrase the presenter
 * typed — the derivation below does not change.
 */
export const PLACEHOLDER_PASSPHRASE = 'buildfoundation-aws-2026'

const NONCE_KEY = 'quiz.presenter.nonce'

/** Per-quiz nonce, stable across a refresh and regenerated only on demand. */
export function getOrCreateNonce(quizId) {
  const key = `${NONCE_KEY}.${quizId}`
  try {
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const fresh = crypto.randomUUID()
    sessionStorage.setItem(key, fresh)
    return fresh
  } catch {
    // Storage disabled: the code still works for this mount, it just won't
    // survive a refresh. Degraded, not broken.
    return crypto.randomUUID()
  }
}

/** Throw the current nonce away so the next derivation yields a new room. */
export function clearNonce(quizId) {
  try {
    sessionStorage.removeItem(`${NONCE_KEY}.${quizId}`)
  } catch {
    // nothing to clear
  }
}

/**
 * SHA-256(passphrase:nonce) → 4 digits.
 *
 * The first four bytes of the digest are read as a big-endian uint32 and taken
 * mod 10000. The modulo bias across 2^32 is ~1 part in 400k — irrelevant for
 * picking a classroom room number.
 */
export async function deriveRoomCode(passphrase, nonce) {
  const bytes = new TextEncoder().encode(`${passphrase}:${nonce}`)
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))
  const n = ((digest[0] << 24) >>> 0) + (digest[1] << 16) + (digest[2] << 8) + digest[3]
  return String(n % 10000).padStart(4, '0')
}

/**
 * The URL the QR code points at. `/quiz` prefills the code from `?code=`, so a
 * phone that scans it only has to type a name.
 *
 * Built from `import.meta.env.BASE_URL` because the site is served from the
 * `/buildfoundation-aws-2026/` subpath on GitHub Pages (CLAUDE.md).
 */
export function joinUrlFor(code) {
  const base = import.meta.env.BASE_URL ?? '/'
  return new URL(`${base}quiz?code=${code}`, window.location.origin).href
}
