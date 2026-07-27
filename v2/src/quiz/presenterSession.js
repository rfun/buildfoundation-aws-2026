/**
 * `usePresenterSession` — the presenter's phase machine, on top of the Ably
 * transport (spec §6, §7.2, §7.4).
 *
 * Division of labour:
 *
 *   `useQuizChannel`   the wire. Owns the Ably client and everything that has
 *                      arrived SINCE THIS MOUNT.
 *   this hook          the session. Owns the phase machine, the room code, and
 *                      the durable answer store that outlives a refresh.
 *
 * That split is the whole reason the crash guard works. A refresh throws away
 * the channel hook's state along with the connection, so the durable copy has to
 * live somewhere the remount can read it back — `sessionStorage` (spec §7.4).
 * On mount the mirror is restored, and everything the channel subsequently
 * reports is merged on top of it. It is a crash guard, not persistence: closing
 * the tab still ends the session and nothing ever reaches a server.
 *
 * Recovering from a presenter refresh needs one more step that is easy to miss.
 * `useQuizChannel` drops incoming `answer` events unless it has published a
 * `state` saying that question is open, and it answers a participant's `sync`
 * with whatever it last published — both of which are empty on a fresh mount. So
 * as soon as the reconnected channel is up, this hook re-publishes the restored
 * state and replays the reveals issued so far. Participants re-sync onto it and
 * answers start counting again.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadScorableQuiz } from '../data/quizzes'
import { scoreParticipant } from './scoring'
import { useQuizChannel, getOrCreateClientId } from './useQuizChannel'
import {
  PLACEHOLDER_PASSPHRASE,
  clearNonce,
  deriveRoomCode,
  getOrCreateNonce,
  joinUrlFor,
} from './roomCode'

const MIRROR_KEY = 'quiz.presenter.session'

/**
 * The restorable half of the session, in one object so a refresh restores it in
 * a single update. `answers`/`roster` here are the mirrored copy only — live
 * ones arrive from the channel and are merged on top.
 */
const EMPTY_MACHINE = {
  phase: 'lobby',
  qIndex: 0,
  endsAt: null,
  revealedCorrect: {},
  answers: {},
  roster: [],
}

/** Take only the machine's own fields out of a mirror snapshot. */
function pickMachine(saved) {
  return {
    phase: saved.phase ?? EMPTY_MACHINE.phase,
    qIndex: saved.qIndex ?? EMPTY_MACHINE.qIndex,
    endsAt: saved.endsAt ?? EMPTY_MACHINE.endsAt,
    revealedCorrect: saved.revealedCorrect ?? EMPTY_MACHINE.revealedCorrect,
    answers: saved.answers ?? EMPTY_MACHINE.answers,
    roster: saved.roster ?? EMPTY_MACHINE.roster,
  }
}

/* ------------------------------------------------------------------ *
 * sessionStorage mirror
 * ------------------------------------------------------------------ */

function mirrorKey(quizId) {
  return `${MIRROR_KEY}.${quizId}`
}

/**
 * Read the mirror back, but only if it belongs to the room we are about to open.
 * A code mismatch means the nonce was regenerated (i.e. "New session"), so the
 * old answers belong to a different room and must not bleed into this one
 * (spec §7.4: "restored on mount if the room code matches").
 */
function readMirror(quizId, code) {
  try {
    const raw = sessionStorage.getItem(mirrorKey(quizId))
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (saved?.code !== code) return null
    return saved
  } catch {
    // Corrupt or unreadable mirror is the same as no mirror — start clean rather
    // than crash the console at the front of a classroom.
    return null
  }
}

function writeMirror(quizId, snapshot) {
  try {
    sessionStorage.setItem(mirrorKey(quizId), JSON.stringify(snapshot))
  } catch {
    // Quota or private mode. The session still runs; it just won't survive a
    // refresh, which is the pre-§7.4 behaviour rather than a new failure.
  }
}

function clearMirror(quizId) {
  try {
    sessionStorage.removeItem(mirrorKey(quizId))
  } catch {
    // nothing to clear
  }
}

/* ------------------------------------------------------------------ *
 * merging restored + live
 * ------------------------------------------------------------------ */

/**
 * Restored answers underneath, live answers on top: anything the channel has
 * seen since this mount is by definition newer than the mirror.
 */
function mergeAnswers(restored, live) {
  const out = { ...restored }
  for (const [clientId, byIndex] of Object.entries(live)) {
    out[clientId] = { ...out[clientId], ...byIndex }
  }
  return out
}

/**
 * Same idea for the roster, with one twist: `present` comes only from the live
 * channel. A restored participant who has not re-entered presence yet is listed
 * (their answers still count, and they still appear in the results grid) but is
 * not counted as connected.
 */
function mergeRoster(restored, live) {
  const out = {}
  for (const p of restored) out[p.clientId] = { ...p, present: false }
  for (const p of live) out[p.clientId] = { ...out[p.clientId], ...p }
  return Object.values(out).sort((a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0))
}

/* ------------------------------------------------------------------ *
 * the hook
 * ------------------------------------------------------------------ */

export function usePresenterSession(quizId) {
  const clientId = useMemo(() => getOrCreateClientId('presenter'), [])

  const [quiz, setQuiz] = useState(null)
  const [error, setError] = useState(null)

  /*
   * Boot: derive the room code, then read the mirror for THAT code, then land
   * both in one update. Code derivation is async (Web Crypto), and the mirror is
   * only valid for a matching code, so the two are one operation rather than two
   * effects racing each other. `machine === null` means "not booted yet", which
   * is also what keeps the channel closed until the restore has happened.
   */
  const [code, setCode] = useState(null)
  const [machine, setMachine] = useState(null)
  const [wasRestored, setWasRestored] = useState(false)
  // Bumped by `reset()` to re-run boot against a freshly generated nonce.
  const [bootKey, setBootKey] = useState(0)

  useEffect(() => {
    let live = true
    // Phase 5 swaps the placeholder for the passphrase the presenter typed; the
    // derivation and everything downstream of it is unchanged by that.
    deriveRoomCode(PLACEHOLDER_PASSPHRASE, getOrCreateNonce(quizId)).then((derived) => {
      if (!live) return
      const saved = readMirror(quizId, derived) // spec §7.4
      setCode(derived)
      setWasRestored(Boolean(saved))
      setMachine(saved ? { ...EMPTY_MACHINE, ...pickMachine(saved) } : EMPTY_MACHINE)
    })
    return () => {
      live = false
    }
  }, [quizId, bootKey])

  const hydrated = machine !== null
  const { phase, qIndex, endsAt, revealedCorrect } = machine ?? EMPTY_MACHINE
  // The durable half of the answer store: whatever was mirrored before a
  // refresh. Live answers arrive through the channel and are merged on top.
  const restoredAnswers = machine?.answers ?? EMPTY_MACHINE.answers
  const restoredRoster = machine?.roster ?? EMPTY_MACHINE.roster

  /* ------------------------------- quiz -------------------------------- */

  useEffect(() => {
    let live = true
    // Presenter-only import: this is where the answer key enters the app, in its
    // own lazy chunk (spec §8).
    loadScorableQuiz(quizId)
      .then((loaded) => live && setQuiz(loaded))
      .catch((e) => live && setError(e.message))
    return () => {
      live = false
    }
  }, [quizId])

  /* ----------------------------- transport ----------------------------- */

  const channel = useQuizChannel({
    code,
    role: 'presenter',
    clientId,
    // Don't open the channel until the mirror has been read: connecting first
    // would let answers arrive against a phase machine that is about to be
    // overwritten by the restore.
    enabled: Boolean(code) && hydrated,
  })

  const { publishState, publishReveal, publishEnded, resetCollected, isConnected } = channel

  const answers = useMemo(
    () => mergeAnswers(restoredAnswers, channel.answers),
    [restoredAnswers, channel.answers],
  )
  const participants = useMemo(
    () => mergeRoster(restoredRoster, channel.participants),
    [restoredRoster, channel.participants],
  )
  const presentCount = useMemo(() => participants.filter((p) => p.present).length, [participants])

  /* ------------------------------- mirror ------------------------------- */

  // Every write to the store re-mirrors it (spec §7.4). The whole snapshot is
  // small — a dozen participants × 13 questions of small integer arrays — so
  // there is no reason to be clever about diffing it.
  useEffect(() => {
    if (!code || !hydrated) return
    writeMirror(quizId, {
      code,
      quizId,
      phase,
      qIndex,
      endsAt,
      revealedCorrect,
      answers,
      // Presence is a live fact, so it is not worth mirroring; on restore
      // everyone reads as not-present until they re-enter.
      roster: participants.map(({ clientId: id, name, joinedAt }) => ({
        clientId: id,
        name,
        joinedAt,
      })),
      savedAt: Date.now(),
    })
  }, [quizId, code, hydrated, phase, qIndex, endsAt, revealedCorrect, answers, participants])

  /* -------------------------- phase transitions -------------------------- */

  const total = quiz?.questions.length ?? 0
  const seconds = quiz?.defaults?.timeToRespondSeconds ?? 45

  const openQuestion = useCallback(
    (index) => {
      const deadline = Date.now() + seconds * 1000
      setMachine((m) => ({ ...m, phase: 'question', qIndex: index, endsAt: deadline }))
      publishState({ quizId, phase: 'question', qIndex: index, endsAt: deadline, revealed: false })
    },
    [publishState, quizId, seconds],
  )

  const start = useCallback(() => openQuestion(0), [openQuestion])

  const reveal = useCallback(() => {
    if (!quiz) return
    const correct = quiz.questions[qIndex]?.correct ?? []
    setMachine((m) => ({
      ...m,
      phase: 'reveal',
      endsAt: null,
      revealedCorrect: { ...m.revealedCorrect, [qIndex]: correct },
    }))
    publishState({ quizId, phase: 'reveal', qIndex, endsAt: null, revealed: true })
    publishReveal(qIndex, correct)
  }, [quiz, qIndex, publishState, publishReveal, quizId])

  const end = useCallback(() => {
    if (!quiz) return
    // At `ended` the full key goes out, so a participant who joined late can
    // still build a complete final review (spec §7.1).
    const fullKey = Object.fromEntries(quiz.questions.map((q, i) => [i, q.correct ?? []]))
    setMachine((m) => ({ ...m, phase: 'ended', endsAt: null, revealedCorrect: fullKey }))
    publishState({ quizId, phase: 'ended', qIndex, endsAt: null, revealed: true })
    publishEnded(fullKey)
  }, [quiz, qIndex, publishState, publishEnded, quizId])

  const next = useCallback(() => {
    if (qIndex + 1 >= total) {
      end()
      return
    }
    openQuestion(qIndex + 1)
  }, [qIndex, total, end, openQuestion])

  /**
   * Start over in a brand-new room. The nonce is thrown away so the next
   * derivation yields a different code — the old room's participants are not
   * silently carried into a session they didn't join.
   */
  const reset = useCallback(() => {
    clearMirror(quizId)
    clearNonce(quizId)
    resetCollected()
    setWasRestored(false)
    // Back to un-booted: the channel closes, and boot re-runs against the new
    // nonce, deriving a new code and opening a new room.
    setCode(null)
    setMachine(null)
    setBootKey((n) => n + 1)
  }, [quizId, resetCollected])

  /* ------------------------ (re)announce on connect ------------------------ */

  // Republish on every fresh connection: on first load this hands a waiting
  // participant the lobby state without them having to `sync`, and after a
  // presenter refresh it is what makes the restored session real again —
  // `useQuizChannel` will otherwise drop incoming answers and reply to `sync`
  // with nothing, because it has published no state since the remount.
  // Tracks the false→true edge of `isConnected` rather than a token, so a drop
  // and recovery mid-session re-announces instead of being deduped away.
  const announced = useRef(false)
  useEffect(() => {
    if (!isConnected || !code || !hydrated) {
      announced.current = false
      return
    }
    if (announced.current) return
    announced.current = true

    publishState({ quizId, phase, qIndex, endsAt, revealed: phase !== 'question' })
    // Replay the reveals already issued so their `correct` payloads are back in
    // the channel's replay set for the next late joiner.
    for (const [index, correct] of Object.entries(revealedCorrect)) {
      publishReveal(Number(index), correct)
    }
    if (phase === 'ended') publishEnded(revealedCorrect)
    // Deliberately keyed on the connection only: this fires when a connection is
    // (re)established, not on every phase change — those publish themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, code, hydrated])

  /* ------------------------- unload warning (§9) ------------------------- */

  // Warn before losing a live session. Armed from the moment anyone has joined
  // or the quiz has started, and stays armed at `ended` — that is precisely when
  // there are results worth exporting and nothing has written them anywhere.
  const isLive = phase !== 'lobby' || participants.length > 0
  useEffect(() => {
    if (!isLive) return undefined
    const onBeforeUnload = (e) => {
      e.preventDefault()
      // Browsers ignore custom text now and show their own wording, but
      // `returnValue` is still what triggers the prompt in several of them.
      e.returnValue = ''
      return ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isLive])

  /* ------------------------------ derived ------------------------------ */

  const questions = useMemo(() => quiz?.questions ?? [], [quiz])
  const question = questions[qIndex] ?? null

  /** Selections per option for the current question — the chart's input. */
  const distribution = useMemo(() => {
    const counts = (question?.options ?? []).map(() => 0)
    for (const p of participants) {
      for (const i of answers[p.clientId]?.[qIndex] ?? []) {
        if (counts[i] !== undefined) counts[i] += 1
      }
    }
    return counts
  }, [participants, answers, qIndex, question])

  /** People who answered THIS question — the `n` in `n / m answered`. */
  const answeredCount = useMemo(
    () => participants.filter((p) => (answers[p.clientId]?.[qIndex] ?? []).length > 0).length,
    [participants, answers, qIndex],
  )

  /**
   * Score one participant. Answers are keyed by `qIndex`, so they are handed to
   * `scoreParticipant` as an array — passing the map directly would look up by
   * question `id` and be off by one.
   */
  const scoreFor = useCallback(
    (participantId) => {
      const theirs = answers[participantId] ?? {}
      return scoreParticipant(
        { id: quizId, questions },
        questions.map((_, i) => theirs[i]),
      )
    },
    [answers, questions, quizId],
  )

  return {
    // identity
    quizId,
    quiz,
    error,
    code,
    joinUrl: code ? joinUrlFor(code) : null,
    wasRestored,

    // phase machine
    phase,
    qIndex,
    question,
    questions,
    total,
    endsAt,
    revealedCorrect,

    // collected data
    participants,
    presentCount,
    answers,
    distribution,
    answeredCount,
    scoreFor,

    // connection (passed straight through)
    connection: channel.connection,
    connectionError: channel.connectionError,
    isConnected,
    retry: channel.retry,

    controls: { start, reveal, next, end, reset, openQuestion },
  }
}
