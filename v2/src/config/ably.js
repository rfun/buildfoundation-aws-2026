/**
 * Ably configuration for the live quiz (spec §3).
 *
 * THIS KEY IS PUBLIC BY DESIGN. GitHub Pages serves static files and cannot hold
 * a secret, so the key ships in the bundle and anyone can read it. That is an
 * accepted risk, not an oversight — see spec §8.
 *
 * It is scoped in the Ably dashboard to the `quiz:*` channel namespace with
 * `publish`, `subscribe` and `presence` only. Verified 2026-07-26 by requesting
 * a token with it and reading back the capability:
 *
 *     {"quiz:*":["presence","publish","subscribe"]}
 *
 * Blast radius of a leak: someone can publish noise into a quiz channel while a
 * session is running. They cannot touch any other namespace, read history from
 * outside `quiz:*`, or administer the account.
 *
 * ROTATING THE KEY: Ably dashboard → app → API keys → revoke this key, create a
 * replacement scoped to `quiz:*` with publish/subscribe/presence, paste it below,
 * then rebuild and sync the repo root (see CLAUDE.md). Nothing else references it.
 */

export const ABLY_KEY = 'ac4QAQ.qPZrvQ:Q6JJw7aBOCizEi2H5aevJ5ZRseSUbVYU__WVmciHBWo'

/** Channel namespace the key is scoped to. Every quiz channel must start with this. */
export const QUIZ_NAMESPACE = 'quiz'

/** `quiz:<code>` — one channel per session (spec §6). */
export function quizChannelName(code) {
  return `${QUIZ_NAMESPACE}:${code}`
}

/**
 * Client options shared by both roles.
 *
 * `echoMessages: false` — a client never receives its own publishes back. The
 * presenter already knows what it published, and a participant's own `answer`
 * coming back would just re-run a reducer for no reason.
 *
 * `recover`/`resume` are left at Ably's defaults: the SDK reconnects and replays
 * missed messages on a short drop by itself, and anything longer is handled by
 * the explicit `sync` round-trip in the protocol (spec §6/§9).
 */
export function ablyClientOptions(clientId) {
  return {
    key: ABLY_KEY,
    clientId,
    echoMessages: false,
    // Keep the tab from burning a connection slot forever if it is backgrounded
    // and then abandoned; a real user coming back reconnects transparently.
    closeOnUnload: true,
  }
}
