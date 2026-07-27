/**
 * DEV-ONLY transport harness for Phase 2.
 *
 * Not part of the product. It is the thinnest possible pair of UIs that exercise
 * every event in spec §6 through `useQuizChannel`, so the transport can be
 * verified with two browser windows before the real presenter console (Phase 3)
 * and participant view (Phase 4) exist. The route is registered only under
 * `import.meta.env.DEV`, so it is not in the production bundle.
 *
 *   /quiz/dev-transport?role=presenter&code=4821
 *   /quiz/dev-transport?role=participant&code=4821&name=Ana
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuizChannel, getOrCreateClientId, FAILED, RECONNECTING } from '../../quiz/useQuizChannel'
import { loadScorableQuiz, getQuiz } from '../../data/quizzes'
import { gradeQuestion, CORRECT, WRONG } from '../../quiz/scoring'

const QUIZ_ID = 'week4'

export default function TransportHarness() {
  const [params] = useSearchParams()
  const role = params.get('role') === 'presenter' ? 'presenter' : 'participant'
  const code = params.get('code') || '4821'
  const name = params.get('name') || 'Tester'
  return role === 'presenter' ? (
    <PresenterHarness code={code} />
  ) : (
    <ParticipantHarness code={code} name={name} />
  )
}

function ConnectionBar({ connection, connectionError, retry }) {
  const tone =
    connection === 'connected'
      ? '#0a7'
      : connection === FAILED
        ? '#c33'
        : connection === RECONNECTING
          ? '#c80'
          : '#666'
  return (
    <div style={{ background: tone, padding: '8px 12px', fontWeight: 700 }}>
      <span data-testid="connection">{connection}</span>
      {connectionError ? <span style={{ fontWeight: 400 }}> — {connectionError}</span> : null}
      {connection === FAILED ? (
        <button type="button" data-testid="retry" onClick={retry} style={{ marginLeft: 12 }}>
          Retry
        </button>
      ) : null}
    </div>
  )
}

const page = { background: '#14145a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui' }
const body = { padding: 16 }

/* ------------------------------- presenter ------------------------------- */

function PresenterHarness({ code }) {
  const clientId = useMemo(() => getOrCreateClientId('presenter'), [])
  const [quiz, setQuiz] = useState(null)
  const [phase, setPhase] = useState('lobby')
  const [qIndex, setQIndex] = useState(0)

  const channel = useQuizChannel({ code, role: 'presenter', clientId })
  const { publishState, publishReveal, publishEnded, answers, participants, presentCount } = channel

  useEffect(() => {
    loadScorableQuiz(QUIZ_ID).then(setQuiz)
  }, [])

  const total = quiz?.questions.length ?? 0
  const seconds = quiz?.defaults?.timeToRespondSeconds ?? 45

  const open = useCallback(
    (index) => {
      setPhase('question')
      setQIndex(index)
      publishState({
        quizId: QUIZ_ID,
        phase: 'question',
        qIndex: index,
        endsAt: Date.now() + seconds * 1000,
        revealed: false,
      })
    },
    [publishState, seconds],
  )

  const reveal = useCallback(() => {
    setPhase('reveal')
    publishState({ quizId: QUIZ_ID, phase: 'reveal', qIndex, endsAt: null, revealed: true })
    publishReveal(qIndex, quiz.questions[qIndex].correct)
  }, [publishState, publishReveal, qIndex, quiz])

  const next = useCallback(() => {
    if (qIndex + 1 >= total) {
      setPhase('ended')
      publishState({ quizId: QUIZ_ID, phase: 'ended', qIndex, endsAt: null, revealed: true })
      publishEnded(Object.fromEntries(quiz.questions.map((q, i) => [i, q.correct])))
      return
    }
    open(qIndex + 1)
  }, [qIndex, total, open, publishState, publishEnded, quiz])

  // Send the lobby state once connected so a participant who is already waiting
  // gets a `state` without having to re-`sync`.
  useEffect(() => {
    if (channel.isConnected && phase === 'lobby') {
      publishState({ quizId: QUIZ_ID, phase: 'lobby', qIndex: 0, endsAt: null, revealed: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.isConnected])

  const answeredCount = participants.filter(
    (p) => (answers[p.clientId]?.[qIndex] ?? []).length > 0,
  ).length

  return (
    <div style={page}>
      <ConnectionBar {...channel} />
      <div style={body}>
        <h1>Presenter · room {code}</h1>
        <p data-testid="phase">
          phase={phase} q={qIndex + 1}/{total} · present={presentCount} · answered={answeredCount}
        </p>

        <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          <button type="button" data-testid="start" onClick={() => open(0)} disabled={!quiz}>
            Start
          </button>
          <button
            type="button"
            data-testid="reveal"
            onClick={reveal}
            disabled={phase !== 'question'}
          >
            Reveal
          </button>
          <button type="button" data-testid="next" onClick={next} disabled={phase !== 'reveal'}>
            Next
          </button>
        </div>

        {quiz && phase !== 'lobby' && phase !== 'ended' ? (
          <p data-testid="prompt">{quiz.questions[qIndex].prompt}</p>
        ) : null}

        <h2>Participants ({participants.length})</h2>
        <table data-testid="grid" style={{ borderCollapse: 'collapse', fontSize: 12 }}>
          <tbody>
            {participants.map((p) => {
              const mine = answers[p.clientId] ?? {}
              const score = quiz
                ? quiz.questions.filter((q, i) => gradeQuestion(q, mine[i]) === CORRECT).length
                : 0
              return (
                <tr key={p.clientId} data-testid={`row-${p.name}`}>
                  <td style={{ border: '1px solid #fff3', padding: 4 }}>
                    {p.name}
                    {p.present ? '' : ' (gone)'}
                  </td>
                  {quiz?.questions.map((q, i) => {
                    const g = gradeQuestion(q, mine[i])
                    return (
                      <td key={i} style={{ border: '1px solid #fff3', padding: 4 }}>
                        {g === CORRECT ? '✓' : g === WRONG ? '✗' : '·'}
                      </td>
                    )
                  })}
                  <td style={{ border: '1px solid #fff3', padding: 4 }} data-testid={`score-${p.name}`}>
                    {score}/{total}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ------------------------------ participant ------------------------------ */

function ParticipantHarness({ code, name }) {
  const clientId = useMemo(() => getOrCreateClientId('p'), [])
  const [questions, setQuestions] = useState(null)
  const channel = useQuizChannel({ code, role: 'participant', clientId, name })
  const { state, revealed, ended, sendAnswer } = channel

  useEffect(() => {
    getQuiz(QUIZ_ID)
      .loadQuestions()
      .then((q) => setQuestions(q.questions))
  }, [])

  const [sent, setSent] = useState({})
  const qIndex = state?.qIndex ?? 0
  const question = questions?.[qIndex]
  const phase = state?.phase ?? 'connecting'

  const pick = (i) => {
    const needed = question.selections ?? 1
    const prev = sent[qIndex] ?? []
    const nextSel = prev.includes(i)
      ? prev.filter((x) => x !== i)
      : needed === 1
        ? [i]
        : [...prev, i].slice(-needed)
    setSent((s) => ({ ...s, [qIndex]: nextSel }))
    if (nextSel.length === needed) sendAnswer(qIndex, nextSel)
  }

  const score = useMemo(() => {
    if (!questions) return 0
    return questions.filter((q, i) => {
      const correct = revealed[i]
      if (!correct) return false
      return gradeQuestion({ ...q, correct }, sent[i]) === CORRECT
    }).length
  }, [questions, revealed, sent])

  return (
    <div style={page}>
      <ConnectionBar {...channel} />
      <div style={body}>
        <h1>{name}</h1>
        <p data-testid="phase">
          phase={phase} q={qIndex + 1}
        </p>

        {ended || phase === 'ended' ? (
          <p data-testid="final">
            Final score {score}/{questions?.length ?? 0}
          </p>
        ) : phase === 'question' && question ? (
          <div>
            <p data-testid="prompt">{question.prompt}</p>
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                data-testid={`opt-${i}`}
                onClick={() => pick(i)}
                style={{
                  display: 'block',
                  margin: 4,
                  padding: 8,
                  background: (sent[qIndex] ?? []).includes(i) ? '#c4a8ff' : '#fff2',
                  color: (sent[qIndex] ?? []).includes(i) ? '#000' : '#fff',
                  border: 0,
                  textAlign: 'left',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : phase === 'reveal' && question ? (
          <div data-testid="reveal">
            <p>
              {revealed[qIndex]
                ? gradeQuestion({ ...question, correct: revealed[qIndex] }, sent[qIndex]) === CORRECT
                  ? 'Correct'
                  : 'Not quite'
                : 'Waiting for answer…'}
            </p>
            <p>Correct: {(revealed[qIndex] ?? []).join(', ')}</p>
          </div>
        ) : (
          <p>Waiting for the presenter…</p>
        )}
      </div>
    </div>
  )
}
