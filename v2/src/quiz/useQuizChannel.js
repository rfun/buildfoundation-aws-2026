/**
 * `useQuizChannel` — the entire Ably transport for the live quiz (spec §6).
 *
 * This is the ONLY module in the app that imports the Ably SDK. Components talk
 * to the session through the return value of this hook; if the transport is ever
 * swapped out, nothing else changes.
 *
 * One channel per session: `quiz:<code>`. Both roles use it:
 *
 *   presenter → `state` `reveal` `ended`      (owns the phase machine)
 *   participant → `join` `answer` `sync`      (owns its own answers)
 *
 * Protocol rules implemented here, straight from spec §6:
 *
 *   - Correct answers are NEVER in `state`. They travel only in `reveal`.
 *   - Late join is allowed at any time: a joining client publishes `sync`, and
 *     the presenter replies with the current `state` plus a replay of every
 *     `reveal` already issued, so the late joiner's screen and final review are
 *     complete without ever learning an unrevealed answer.
 *   - Answers may be changed while `phase === "question"`; last write wins per
 *     `(clientId, qIndex)`. Once the phase moves on, answers for that `qIndex`
 *     are dropped by the presenter.
 *   - Presence drives the lobby's connected list. A participant who drops stays
 *     in the roster (their answers still count) but is marked not present.
 *
 * Connection state is always one of `connecting | connected | reconnecting |
 * failed` and is surfaced to the UI. `failed` comes with `retry()`. There is no
 * silent hang (spec §9).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Ably from 'ably'
import { ablyClientOptions, quizChannelName } from '../config/ably'

export const EVENTS = {
  STATE: 'state',
  REVEAL: 'reveal',
  ENDED: 'ended',
  JOIN: 'join',
  ANSWER: 'answer',
  SYNC: 'sync',
}

export const CONNECTING = 'connecting'
export const CONNECTED = 'connected'
export const RECONNECTING = 'reconnecting'
export const FAILED = 'failed'

/**
 * Ably connection states → the four states the UI is allowed to see.
 *
 * `disconnected` is a short blip the SDK retries out of by itself, so it reads
 * as `reconnecting`. `suspended` means Ably has fallen back to slow retries
 * (minutes apart) — for a live classroom that is indistinguishable from down, so
 * it is surfaced as `failed` with a retry rather than left spinning.
 */
function toConnectionState(ablyState) {
  switch (ablyState) {
    case 'connected':
      return CONNECTED
    case 'disconnected':
      return RECONNECTING
    case 'suspended':
    case 'failed':
    case 'closed':
    case 'closing':
      return FAILED
    default: // initialized, connecting
      return CONNECTING
  }
}

/**
 * How long we allow `connecting`/`reconnecting` to drag on before calling it.
 * Spec §9 requires an explicit "can't connect" state — never a silent hang — and
 * Ably on a dead network will happily sit in `disconnected` retrying forever.
 */
const CONNECT_TIMEOUT_MS = 15000

const CLIENT_ID_KEY = 'quiz.clientId'

/**
 * A stable per-tab identity (spec §6). Kept in `sessionStorage` so a refresh or a
 * dropped connection rejoins as the same person instead of creating a duplicate
 * row in the presenter's grid.
 */
export function getOrCreateClientId(prefix = 'p') {
  const key = `${CLIENT_ID_KEY}.${prefix}`
  try {
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const fresh = `${prefix}-${crypto.randomUUID()}`
    sessionStorage.setItem(key, fresh)
    return fresh
  } catch {
    // Private mode / storage disabled: fall back to a per-mount id. Reconnects
    // will look like a new participant, which is degraded but not broken.
    return `${prefix}-${crypto.randomUUID()}`
  }
}

/** Presenter replies to a burst of `sync` requests once, not once per request. */
const SYNC_COALESCE_MS = 200

/**
 * @param {object} opts
 * @param {string} opts.code           4-digit room code; channel is `quiz:<code>`
 * @param {'presenter'|'participant'} opts.role
 * @param {string} opts.clientId       stable id from `getOrCreateClientId()`
 * @param {string} [opts.name]         participant display name (presence + `join`)
 * @param {boolean} [opts.enabled]     false keeps the hook idle (e.g. before join)
 */
export function useQuizChannel({ code, role, clientId, name, enabled = true }) {
  const isPresenter = role === 'presenter'

  const [connection, setConnection] = useState(CONNECTING)
  const [connectionError, setConnectionError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  // --- participant-facing session state (what the presenter has told us) ---
  const [state, setState] = useState(null)
  const [revealed, setRevealed] = useState({}) // qIndex -> number[]
  const [ended, setEnded] = useState(false)

  // --- presenter-facing collected state ---
  const [roster, setRoster] = useState({}) // clientId -> { clientId, name, joinedAt, present }
  const [answers, setAnswers] = useState({}) // clientId -> { qIndex -> number[] }

  const channelRef = useRef(null)
  const clientRef = useRef(null)

  // Last thing the presenter published, replayed verbatim on `sync`. Refs, not
  // state, because the message handler must see the current values without
  // re-subscribing on every phase change.
  const lastStateRef = useRef(null)
  const revealsRef = useRef({})
  const endedRef = useRef(false)
  const lastSyncReplyRef = useRef(0)
  // Kept in a ref so a name edit doesn't tear down and rebuild the connection;
  // presence/`join` publishes read the latest value.
  const nameRef = useRef(name)
  useEffect(() => {
    nameRef.current = name
  }, [name])

  const active = Boolean(enabled && code && clientId)

  /* ------------------------------------------------------------------ *
   * Publish helpers. All of them no-op when the channel isn't attached,
   * so a component never has to guard on connection state before calling.
   * ------------------------------------------------------------------ */

  const publish = useCallback((event, payload) => {
    const channel = channelRef.current
    if (!channel) return Promise.resolve(false)
    return channel.publish(event, payload).then(
      () => true,
      // A failed publish is not fatal — the connection handler already drives the
      // UI's reconnecting/failed banner, and the next `sync` re-establishes truth.
      () => false,
    )
  }, [])

  /* ---------------------------- presenter ---------------------------- */

  /**
   * Broadcast the phase machine. `correct` is deliberately absent — see spec §6.
   * `at` is the presenter's clock at publish time so receivers can rebase
   * `endsAt` onto their own clock instead of trusting clock agreement.
   */
  const publishState = useCallback(
    (next) => {
      const payload = {
        quizId: next.quizId ?? null,
        phase: next.phase,
        qIndex: next.qIndex ?? 0,
        endsAt: next.endsAt ?? null,
        revealed: Boolean(next.revealed),
        at: Date.now(),
      }
      lastStateRef.current = payload
      return publish(EVENTS.STATE, payload)
    },
    [publish],
  )

  /** The one and only moment correct answers go on the wire. */
  const publishReveal = useCallback(
    (qIndex, correct) => {
      const payload = { qIndex, correct }
      revealsRef.current = { ...revealsRef.current, [qIndex]: correct }
      setRevealed(revealsRef.current)
      return publish(EVENTS.REVEAL, payload)
    },
    [publish],
  )

  /**
   * End of quiz. `finalKey` (qIndex -> correct[]) is optional and, when given,
   * is replayed as `reveal` events first so a participant who joined late can
   * still build a complete final review (spec §7.1).
   */
  const publishEnded = useCallback(
    async (finalKey) => {
      if (finalKey) {
        const merged = { ...revealsRef.current }
        for (const [qIndex, correct] of Object.entries(finalKey)) {
          if (merged[qIndex]) continue
          merged[qIndex] = correct
          await publish(EVENTS.REVEAL, { qIndex: Number(qIndex), correct })
        }
        revealsRef.current = merged
        setRevealed(merged)
      }
      endedRef.current = true
      setEnded(true)
      return publish(EVENTS.ENDED, {})
    },
    [publish],
  )

  /** Wipe collected answers/roster — used when the presenter restarts a session. */
  const resetCollected = useCallback(() => {
    setAnswers({})
    setRoster({})
    revealsRef.current = {}
    setRevealed({})
    endedRef.current = false
    setEnded(false)
  }, [])

  /* --------------------------- participant --------------------------- */

  const sendJoin = useCallback(
    () => publish(EVENTS.JOIN, { clientId, name: nameRef.current, at: Date.now() }),
    [publish, clientId],
  )

  /** Last write wins on `(clientId, qIndex)` — no local dedupe, the presenter decides. */
  const sendAnswer = useCallback(
    (qIndex, selected) =>
      publish(EVENTS.ANSWER, { clientId, qIndex, selected, at: Date.now() }),
    [publish, clientId],
  )

  /** Ask the presenter to re-broadcast where we are. Sent on connect and reconnect. */
  const requestSync = useCallback(() => publish(EVENTS.SYNC, { clientId }), [publish, clientId])

  /* ------------------------------------------------------------------ *
   * Connection + subscription lifecycle.
   * ------------------------------------------------------------------ */

  useEffect(() => {
    if (!active) return undefined

    let disposed = false
    const client = new Ably.Realtime(ablyClientOptions(clientId))
    clientRef.current = client
    const channel = client.channels.get(quizChannelName(code))
    channelRef.current = channel

    // --- connection state → UI ---
    const onConnection = (change) => {
      if (disposed) return
      const next = toConnectionState(change.current)
      setConnection(next)
      if (next === FAILED) {
        setConnectionError(change.reason?.message ?? 'Could not reach the quiz server.')
      } else if (next === CONNECTED) {
        setConnectionError(null)
      }
    }
    // A fresh client is always `initialized`, which maps to the `connecting`
    // default, so there is nothing to read back here — every subsequent
    // transition arrives through `onConnection`.
    client.connection.on(onConnection)

    // --- message handlers ---
    const handlers = {}

    if (isPresenter) {
      handlers[EVENTS.JOIN] = (msg) => {
        const from = msg.clientId ?? msg.data?.clientId
        if (!from) return
        setRoster((prev) => ({
          ...prev,
          [from]: {
            clientId: from,
            name: msg.data?.name ?? prev[from]?.name ?? 'Anonymous',
            joinedAt: prev[from]?.joinedAt ?? msg.data?.at ?? Date.now(),
            present: true,
          },
        }))
      }

      handlers[EVENTS.ANSWER] = (msg) => {
        // Trust Ably's authenticated `clientId` over the one in the payload.
        const from = msg.clientId ?? msg.data?.clientId
        const { qIndex, selected } = msg.data ?? {}
        if (!from || typeof qIndex !== 'number' || !Array.isArray(selected)) return

        // Spec §6: answers only count while that question is open. Anything that
        // arrives after Reveal — a late packet, or a participant with a stale
        // screen — is dropped rather than overwriting a recorded answer.
        const current = lastStateRef.current
        if (!current || current.phase !== 'question' || current.qIndex !== qIndex) return

        setAnswers((prev) => ({ ...prev, [from]: { ...prev[from], [qIndex]: selected } }))
      }

      handlers[EVENTS.SYNC] = () => {
        const now = Date.now()
        if (now - lastSyncReplyRef.current < SYNC_COALESCE_MS) return
        lastSyncReplyRef.current = now
        const current = lastStateRef.current
        if (!current) return
        // Re-send state with a fresh `at` so the receiver rebases `endsAt`
        // against its own clock correctly.
        channel.publish(EVENTS.STATE, { ...current, at: now }).catch(() => {})
        // Replay every reveal already issued. Nothing unrevealed is included, so
        // a late joiner learns past answers only — exactly what the class has
        // already seen on the projector.
        for (const [qIndex, correct] of Object.entries(revealsRef.current)) {
          channel.publish(EVENTS.REVEAL, { qIndex: Number(qIndex), correct }).catch(() => {})
        }
        if (endedRef.current) channel.publish(EVENTS.ENDED, {}).catch(() => {})
      }
    } else {
      handlers[EVENTS.STATE] = (msg) => {
        const data = msg.data ?? {}
        // Rebase the deadline onto this client's clock: trust the *duration* the
        // presenter sent, never the absolute timestamp (plan risk register).
        const skew = typeof data.at === 'number' ? Date.now() - data.at : 0
        setState({
          ...data,
          localEndsAt: typeof data.endsAt === 'number' ? data.endsAt + skew : null,
          receivedAt: Date.now(),
        })
        if (data.phase === 'ended') setEnded(true)
      }

      handlers[EVENTS.REVEAL] = (msg) => {
        const { qIndex, correct } = msg.data ?? {}
        if (typeof qIndex !== 'number' || !Array.isArray(correct)) return
        setRevealed((prev) => ({ ...prev, [qIndex]: correct }))
      }

      handlers[EVENTS.ENDED] = () => setEnded(true)
    }

    for (const [event, fn] of Object.entries(handlers)) channel.subscribe(event, fn)

    // --- presence: participants enter, the presenter only watches ---
    const onPresence = (member) => {
      if (!isPresenter) return
      const id = member.clientId
      if (!id) return
      setRoster((prev) => {
        const leaving = member.action === 'leave' || member.action === 'absent'
        const existing = prev[id]
        if (leaving && !existing) return prev
        return {
          ...prev,
          [id]: {
            clientId: id,
            name: member.data?.name ?? existing?.name ?? 'Anonymous',
            joinedAt: existing?.joinedAt ?? member.timestamp ?? Date.now(),
            present: !leaving,
          },
        }
      })
    }

    let cancelled = false
    ;(async () => {
      try {
        await channel.attach()
        if (cancelled) return

        if (isPresenter) {
          channel.presence.subscribe(['enter', 'update', 'leave'], onPresence)
          const members = await channel.presence.get()
          if (cancelled) return
          members.forEach((m) => onPresence({ ...m, action: 'enter' }))
        } else {
          await channel.presence.enter({ name: nameRef.current })
          if (cancelled) return
          // Announce ourselves, then ask where the quiz currently is. Both are
          // safe to repeat — `join` is idempotent and `sync` is coalesced.
          await channel.publish(EVENTS.JOIN, {
            clientId,
            name: nameRef.current,
            at: Date.now(),
          })
          await channel.publish(EVENTS.SYNC, { clientId })
        }
      } catch (err) {
        if (cancelled) return
        setConnection(FAILED)
        setConnectionError(err?.message ?? 'Could not join the quiz room.')
      }
    })()

    // A reconnect after a drop needs a fresh `sync` — the presenter may have
    // moved on several questions while we were away.
    const onReconnected = (change) => {
      if (disposed || isPresenter) return
      if (change.previous === 'disconnected' || change.previous === 'suspended') {
        channel.presence.enter({ name: nameRef.current }).catch(() => {})
        channel.publish(EVENTS.SYNC, { clientId }).catch(() => {})
      }
    }
    client.connection.on('connected', onReconnected)

    return () => {
      disposed = true
      cancelled = true
      // Drop every listener before closing, so a state change fired during
      // teardown can't call setState on an unmounted component.
      client.connection.off(onConnection)
      client.connection.off('connected', onReconnected)
      try {
        channel.unsubscribe()
        channel.presence.unsubscribe()
        if (!isPresenter) channel.presence.leave().catch(() => {})
      } catch {
        // Channel already torn down with the connection; nothing to clean up.
      }
      try {
        // `close()` rejects anything still in flight — an `attach` or
        // `presence.enter` that hasn't settled — with `Connection closed`.
        //
        // In dev you will see a few of those in the console on every mount: React
        // StrictMode mounts, tears down and remounts, so the first client is
        // closed mid-attach and Ably re-throws the rejection from its own event
        // loop, out of reach of this try/catch. Verified harmless — with
        // StrictMode off (i.e. any production build, where effects run once) the
        // count is zero. Nothing here is left dangling either way.
        client.close()
      } catch {
        // ignore
      }
      channelRef.current = null
      clientRef.current = null
    }
    // `attempt` is the retry lever: bumping it rebuilds the client from scratch.
  }, [active, code, clientId, isPresenter, attempt])

  // Watchdog: never leave the UI spinning. If we have not reached `connected`
  // within CONNECT_TIMEOUT_MS of entering connecting/reconnecting, show `failed`
  // with a retry (spec §9). Ably keeps retrying underneath, so if it does come
  // back on its own the `connected` event clears this without the user acting.
  useEffect(() => {
    if (!active) return undefined
    if (connection === CONNECTED || connection === FAILED) return undefined
    const id = setTimeout(() => {
      setConnection(FAILED)
      setConnectionError((prev) => prev ?? 'Can’t reach the quiz server. Check your connection.')
    }, CONNECT_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [active, connection])

  /** Explicit user-driven retry for the `failed` state (spec §9). */
  const retry = useCallback(() => {
    setConnectionError(null)
    setConnection(CONNECTING)
    setAttempt((n) => n + 1)
  }, [])

  /** Roster as a stable, sorted array — join order, which is what the lobby shows. */
  const participants = useMemo(
    () => Object.values(roster).sort((a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0)),
    [roster],
  )

  const presentCount = useMemo(
    () => participants.filter((p) => p.present).length,
    [participants],
  )

  return {
    // connection
    connection,
    connectionError,
    isConnected: connection === CONNECTED,
    retry,

    // participant view of the session
    state,
    revealed,
    ended,

    // presenter's collected data
    participants,
    presentCount,
    answers,

    // presenter actions
    publishState,
    publishReveal,
    publishEnded,
    resetCollected,

    // participant actions
    sendJoin,
    sendAnswer,
    requestSync,
  }
}
