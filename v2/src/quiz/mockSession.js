/**
 * Phase 1 mock session — stands in for the Ably channel (spec §6).
 *
 * Everything here is local state in one browser tab. It exists so the views can
 * be built and clicked through before the transport lands in Phase 2, and it is
 * shaped like the wire protocol on purpose:
 *
 *   - the presenter owns `{ phase, qIndex, endsAt }` and pushes it out (`state`)
 *   - correct answers are NOT known to the participant until reveal, so they
 *     arrive through `revealedCorrect[qIndex]`, mirroring the `reveal` event
 *   - answers are keyed `(clientId, qIndex)`, last write wins
 *
 * Phase 2 replaces this module with `useQuizChannel`; the components should not
 * need to change shape when it does.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getQuiz } from '../data/quizzes'
import { scoreParticipant } from './scoring'

export const PHASES = ['lobby', 'question', 'reveal', 'ended']

export const YOU = 'you'

/** Fake classmates so the presenter lobby/results have something to render. */
const MOCK_NAMES = ['Ana', 'Marcus', 'Priya', 'Diego', 'Yuki', 'Sam']

function mockRoster(questionCount, answerKey) {
  const now = Date.now()
  return MOCK_NAMES.map((name, i) => {
    const answers = {}
    for (let q = 0; q < questionCount; q += 1) {
      // Deterministic pseudo-random so the grid doesn't reshuffle on re-render.
      const seed = (i + 1) * 7 + q * 13
      const correct = answerKey[q] ?? [0]
      answers[q] = seed % 3 === 0 ? [(correct[0] + 1) % 4] : correct
    }
    return { clientId: `mock-${i}`, name, joinedAt: now - (MOCK_NAMES.length - i) * 4000, answers }
  })
}

/**
 * @param {string} quizId
 * @param {{ withRoster?: boolean }} [opts] presenter views want fake classmates;
 *   the participant view only needs itself.
 */
export function useMockSession(quizId, { withRoster = false } = {}) {
  const [quiz, setQuiz] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [phase, setPhase] = useState('lobby')
  const [qIndex, setQIndex] = useState(0)
  const [endsAt, setEndsAt] = useState(null)
  const [revealedCorrect, setRevealedCorrect] = useState({})
  const [answers, setAnswers] = useState({}) // clientId -> { qIndex: number[] }
  const [roster, setRoster] = useState([])

  // The full answer key never reaches participant state — it is held here only
  // so the mock can publish it one question at a time at reveal, like Ably would.
  const answerKey = useRef({})

  const entry = getQuiz(quizId)
  const error = entry ? loadError : `Unknown quiz: ${quizId}`

  useEffect(() => {
    if (!entry) return undefined
    let live = true
    Promise.all([entry.loadQuestions(), entry.loadAnswers()])
      .then(([loaded, key]) => {
        if (!live) return
        const byIndex = loaded.questions.map((q) => key.answers[String(q.id)] ?? [])
        answerKey.current = byIndex
        setQuiz(loaded)
        if (withRoster) setRoster(mockRoster(loaded.questions.length, byIndex))
      })
      .catch((e) => live && setLoadError(e.message))
    return () => {
      live = false
    }
  }, [entry, withRoster])

  const questions = useMemo(() => quiz?.questions ?? [], [quiz])
  const total = questions.length
  const seconds = quiz?.defaults?.timeToRespondSeconds ?? 45

  const openQuestion = useCallback(
    (index) => {
      setQIndex(index)
      setPhase('question')
      setEndsAt(Date.now() + seconds * 1000)
    },
    [seconds],
  )

  const start = useCallback(() => openQuestion(0), [openQuestion])

  const reveal = useCallback(() => {
    setPhase('reveal')
    setEndsAt(null)
    setRevealedCorrect((prev) => ({ ...prev, [qIndex]: answerKey.current[qIndex] ?? [] }))
  }, [qIndex])

  const next = useCallback(() => {
    if (qIndex + 1 >= total) {
      setPhase('ended')
      setEndsAt(null)
      // At `ended` the presenter publishes the whole key so participants can
      // build their final review (spec §7.1).
      setRevealedCorrect(Object.fromEntries(answerKey.current.map((c, i) => [i, c])))
      return
    }
    openQuestion(qIndex + 1)
  }, [qIndex, total, openQuestion])

  const end = useCallback(() => {
    setPhase('ended')
    setEndsAt(null)
    setRevealedCorrect(Object.fromEntries(answerKey.current.map((c, i) => [i, c])))
  }, [])

  const reset = useCallback(() => {
    setPhase('lobby')
    setQIndex(0)
    setEndsAt(null)
    setRevealedCorrect({})
    setAnswers({})
  }, [])

  /** Last write wins on (clientId, qIndex); ignored once the question is revealed. */
  const submitAnswer = useCallback(
    (clientId, index, selected) => {
      if (phase !== 'question') return
      setAnswers((prev) => ({ ...prev, [clientId]: { ...prev[clientId], [index]: selected } }))
    },
    [phase],
  )

  const question = questions[qIndex] ?? null

  /** Participants = mock roster + you, with their answers merged in. */
  const participants = useMemo(() => {
    const rows = roster.map((p) => ({ ...p, answers: { ...p.answers, ...answers[p.clientId] } }))
    // `joinedAt` comes from the Ably presence set in Phase 2; unknown here.
    return [...rows, { clientId: YOU, name: 'You', joinedAt: null, answers: answers[YOU] ?? {} }]
  }, [roster, answers])

  /** Answer counts per option for the current question (presenter chart input). */
  const distribution = useMemo(() => {
    const counts = (question?.options ?? []).map(() => 0)
    participants.forEach((p) => {
      ;(p.answers[qIndex] ?? []).forEach((i) => {
        if (counts[i] !== undefined) counts[i] += 1
      })
    })
    return counts
  }, [participants, qIndex, question])

  const answeredCount = participants.filter((p) => (p.answers[qIndex] ?? []).length > 0).length

  /**
   * Score a participant against everything revealed so far. Answers are passed
   * as an array indexed by `qIndex` — the participant maps are keyed by index,
   * not by question id, so handing the map straight to `scoreParticipant` would
   * be off by one.
   */
  const scoreFor = useCallback(
    (clientId) => {
      const withCorrect = {
        questions: questions.map((q, i) => ({ ...q, correct: revealedCorrect[i] ?? [] })),
      }
      const theirs = participants.find((p) => p.clientId === clientId)?.answers ?? {}
      return scoreParticipant(withCorrect, questions.map((_, i) => theirs[i]))
    },
    [questions, revealedCorrect, participants],
  )

  return {
    quiz,
    error,
    questions,
    question,
    total,
    phase,
    qIndex,
    endsAt,
    revealedCorrect,
    answers,
    participants,
    distribution,
    answeredCount,
    scoreFor,
    submitAnswer,
    controls: { start, reveal, next, end, reset, openQuestion },
  }
}

/** Remaining whole seconds until `endsAt`, or null when no timer is running. */
export function useCountdown(endsAt) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!endsAt) return undefined
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
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
