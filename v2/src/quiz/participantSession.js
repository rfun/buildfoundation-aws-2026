/**
 * `useParticipantSession` — the participant half of the live quiz (spec §6, §7.1).
 *
 * Mirror image of `presenterSession.js`, and the same division of labour:
 *
 *   `useQuizChannel`   the wire. Owns the Ably client, the incoming `state` /
 *                      `reveal` / `ended` stream, and the stable `clientId`.
 *   this hook          the session. Owns what THIS person answered, the quiz
 *                      questions, and the locally-computed final review.
 *
 * Three things are worth calling out, because they are where the participant
 * side differs from the presenter side:
 *
 * 1. **The participant never loads the answer key.** Only `loadQuestions()` is
 *    called here — no `loadAnswers()`, no `loadScorableQuiz()`. Correct answers
 *    arrive one question at a time over `reveal`, which is what keeps them out of
 *    the participant's chunk graph (spec §8). Everything scored below is scored
 *    against `revealed`, never against a bundled key.
 *
 * 2. **The quiz to load is told to us, not chosen by us.** `state.quizId` comes
 *    from the presenter, so nothing loads until the first `state` arrives. A
 *    participant sitting on the join screen has fetched no quiz data at all.
 *
 * 3. **Answers are mirrored to `sessionStorage`.** The `clientId` already
 *    survives a refresh so the presenter sees one row, not two (spec §6) — but
 *    the presenter's copy of the answers is not readable from here, so without a
 *    local mirror a refresh would leave this person with a blank final review of
 *    a quiz they actually answered. Same crash-guard reasoning as spec §7.4, one
 *    tab over. Keyed by room code, so a different room starts clean.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getQuiz } from '../data/quizzes'
import { scoreParticipant } from './scoring'
import { useQuizChannel, getOrCreateClientId } from './useQuizChannel'

const ANSWERS_KEY = 'quiz.participant.answers'
const NAME_KEY = 'quiz.participant.name'

/* ------------------------------------------------------------------ *
 * sessionStorage: the display name and this person's own answers
 * ------------------------------------------------------------------ */

/**
 * The name typed on the join screen. Kept so a refresh of `/quiz/room/:code`
 * rejoins under the same name even if the `?name=` query param is lost — the
 * presenter matches on `clientId`, so a mismatched name would relabel an
 * existing row rather than duplicate it, but it would still be confusing.
 */
export function rememberName(name) {
  try {
    sessionStorage.setItem(NAME_KEY, name)
  } catch {
    // Private mode: the URL still carries the name. Degraded, not broken.
  }
}

export function recallName() {
  try {
    return sessionStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

function answersKey(code) {
  return `${ANSWERS_KEY}.${code}`
}

function readAnswers(code) {
  try {
    const raw = sessionStorage.getItem(answersKey(code))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    // Corrupt mirror reads as no mirror — never break the quiz over it.
    return {}
  }
}

function writeAnswers(code, answers) {
  try {
    sessionStorage.setItem(answersKey(code), JSON.stringify(answers))
  } catch {
    // Quota or private mode; the in-memory copy still drives this session.
  }
}

/* ------------------------------------------------------------------ *
 * the hook
 * ------------------------------------------------------------------ */

/**
 * @param {string} code  4-digit room code from the route
 * @param {string} name  display name from the join screen
 */
export function useParticipantSession(code, name) {
  // Stable across refresh and reconnect, so the presenter's grid keeps one row
  // for this person instead of growing a new one every time (spec §6, §9).
  const clientId = useMemo(() => getOrCreateClientId('p'), [])

  const [quiz, setQuiz] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // This person's own answers, `qIndex -> number[]`. Restored from the mirror on
  // mount so a refresh mid-quiz doesn't blank out the final review.
  const [answers, setAnswers] = useState(() => readAnswers(code))

  const channel = useQuizChannel({ code, role: 'participant', clientId, name })
  const { state, revealed, ended, sendAnswer } = channel

  /* ------------------------------ the quiz ------------------------------ */

  const quizId = state?.quizId ?? null
  const entry = quizId ? getQuiz(quizId) : null

  // An unknown quiz id is a fact about the props, not something to store — it can
  // only mean this page is older than the presenter's build.
  const error =
    quizId && !entry
      ? `The presenter is running a quiz this page doesn’t know about (${quizId}). Reload to pick up the latest version of the site.`
      : loadError

  useEffect(() => {
    if (!entry) return undefined
    let live = true
    // Questions only — the answer key is never fetched on this route (spec §8).
    entry
      .loadQuestions()
      .then((loaded) => live && setQuiz(loaded))
      .catch((e) => live && setLoadError(e.message))
    return () => {
      live = false
    }
  }, [entry])

  /* ----------------------------- the mirror ----------------------------- */

  // Skip the write on the first render: it would just rewrite what we read.
  const mirrored = useRef(false)
  useEffect(() => {
    if (!mirrored.current) {
      mirrored.current = true
      return
    }
    writeAnswers(code, answers)
  }, [code, answers])

  /* ------------------------------ answering ------------------------------ */

  const questions = useMemo(() => quiz?.questions ?? [], [quiz])
  const total = questions.length
  const phase = state?.phase ?? null
  const qIndex = state?.qIndex ?? 0
  const question = questions[qIndex] ?? null

  /**
   * Send an answer. Answers may be changed while the question is open — last
   * write wins on `(clientId, qIndex)`, and the presenter drops anything that
   * arrives after Reveal (spec §6), so there is nothing to guard here beyond the
   * phase we can see.
   */
  const submitAnswer = useCallback(
    (index, selected) => {
      if (state?.phase !== 'question') return
      setAnswers((prev) => ({ ...prev, [index]: selected }))
      sendAnswer(index, selected)
    },
    [state?.phase, sendAnswer],
  )

  /* ---------------------------- final review ---------------------------- */

  /**
   * The final review, computed here from what this client already has: its own
   * answers plus the `reveal` payloads (spec §7.1). Nothing is asked of the
   * presenter and nothing is scored server-side.
   *
   * Questions this person never answered come back as `blank`, and
   * `scoreParticipant` counts blanks against neither tally — that is what makes a
   * late joiner scored only on the questions they were actually present for
   * (spec §6), rather than starting six questions in the hole.
   *
   * A question with no revealed key is treated as unanswered for the same
   * reason: with no `correct` to compare against, grading it would mark it wrong
   * on no evidence. In a normal run this never fires — the presenter broadcasts
   * the whole key at `ended` (spec §7.1) — it only matters if the quiz is cut
   * short.
   */
  const score = useMemo(() => {
    const withRevealed = questions.map((q, i) => ({ ...q, correct: revealed[i] ?? [] }))
    return scoreParticipant(
      { id: quizId, questions: withRevealed },
      questions.map((_, i) => (revealed[i] ? answers[i] : undefined)),
    )
  }, [questions, revealed, answers, quizId])

  return {
    // identity
    code,
    name,
    clientId,
    quiz,
    quizId,
    error,

    // where the presenter has us
    phase,
    qIndex,
    question,
    questions,
    total,
    // Already rebased onto this client's clock by `useQuizChannel` — see
    // `useCountdown` in `display.js`.
    endsAt: state?.localEndsAt ?? null,
    revealed,
    ended: ended || phase === 'ended',

    // us
    answers,
    submitAnswer,
    score,

    // connection (passed straight through)
    connection: channel.connection,
    connectionError: channel.connectionError,
    isConnected: channel.isConnected,
    retry: channel.retry,
  }
}
