/**
 * `/quiz/room/:code` — participant play (spec §7.1):
 * lobby → question → reveal → final review.
 *
 * Phase 1 runs on `useMockSession`, so the "presenter" is the control strip at
 * the bottom of the screen. Phase 4 swaps that for the real channel and drops
 * the strip; the four view bodies below should survive unchanged.
 */

import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useMockSession, useCountdown, YOU, optionLetter } from '../../quiz/mockSession'
import { CORRECT, WRONG } from '../../quiz/scoring'
import {
  QuizShell,
  Eyebrow,
  QuestionHeader,
  Option,
  PrimaryButton,
  Card,
  MockControls,
} from '../../quiz/ui'

const MOCK_QUIZ_ID = 'week4'

export default function QuizRoom() {
  const { code } = useParams()
  const [params] = useSearchParams()
  const name = params.get('name') || 'You'

  const session = useMockSession(MOCK_QUIZ_ID)
  const { quiz, error, phase, qIndex, question, total, endsAt, revealedCorrect, controls } = session
  const clock = useCountdown(endsAt)
  const locked = clock === 0

  const myAnswers = session.answers[YOU] ?? {}
  const sent = myAnswers[qIndex] ?? []
  const [draft, setDraft] = useState([])
  const [draftFor, setDraftFor] = useState(qIndex)

  // New question → reset the pad to whatever was already sent for it (usually
  // nothing). Adjusting state during render is the supported way to do this.
  if (draftFor !== qIndex) {
    setDraftFor(qIndex)
    setDraft(sent)
  }

  // "Submitted" is not its own state — it's just the pad matching what was sent.
  const submitted =
    sent.length > 0 && sent.length === draft.length && sent.every((i) => draft.includes(i))

  if (error) {
    return (
      <QuizShell width="max-w-md">
        <Card className="my-auto text-center">
          <p className="font-semibold mb-2">Couldn’t load the quiz</p>
          <p className="text-white/60 text-sm mb-4">{error}</p>
          <Link to="/quiz" className="text-[#c4aaff] font-semibold text-sm underline">
            Back to join
          </Link>
        </Card>
      </QuizShell>
    )
  }

  if (!quiz) {
    return (
      <QuizShell width="max-w-md">
        <p className="my-auto text-center text-white/50">Loading…</p>
      </QuizShell>
    )
  }

  const needed = question?.selections ?? 1
  const toggle = (i) => {
    if (locked) return
    setDraft((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i)
      if (needed === 1) return [i]
      if (prev.length >= needed) return [...prev.slice(1), i]
      return [...prev, i]
    })
  }

  const submit = () => {
    if (draft.length !== needed || locked) return
    session.submitAnswer(YOU, qIndex, draft)
  }

  const mock = (
    <MockControls
      items={[
        { label: 'Start', onClick: controls.start, disabled: phase !== 'lobby' },
        { label: 'Reveal', onClick: controls.reveal, disabled: phase !== 'question' },
        { label: 'Next', onClick: controls.next, disabled: phase !== 'reveal' },
        { label: 'End', onClick: controls.end, disabled: phase === 'ended' },
        { label: 'Reset', onClick: controls.reset },
      ]}
    />
  )

  return (
    <QuizShell width="max-w-xl" footer={mock}>
      {phase === 'lobby' && <LobbyView code={code} name={name} quiz={quiz} />}

      {phase === 'question' && question && (
        <>
          <QuestionHeader
            qIndex={qIndex}
            total={total}
            clock={clock}
            hint={needed === 1 ? 'Pick 1' : `Pick ${needed}`}
          />
          <h2 className="text-lg sm:text-2xl font-semibold leading-snug mb-5">{question.prompt}</h2>

          <div className="flex flex-col gap-3">
            {question.options.map((opt, i) => (
              <Option
                key={i}
                index={i}
                label={opt}
                state={draft.includes(i) ? 'selected' : 'idle'}
                onClick={() => toggle(i)}
                disabled={locked}
              />
            ))}
          </div>

          <div className="mt-6 sticky bottom-4">
            <PrimaryButton onClick={submit} disabled={draft.length !== needed || locked}>
              {locked
                ? 'Time’s up'
                : submitted
                  ? 'Answer sent — tap to change'
                  : draft.length === needed
                    ? 'Submit'
                    : `Select ${needed - draft.length} more`}
            </PrimaryButton>
            {submitted && !locked ? (
              <p className="text-center text-white/45 text-xs mt-2">
                You can change your answer until the presenter reveals.
              </p>
            ) : null}
          </div>
        </>
      )}

      {phase === 'reveal' && question && (
        <RevealView
          qIndex={qIndex}
          total={total}
          question={question}
          selected={myAnswers[qIndex] ?? []}
          correct={revealedCorrect[qIndex] ?? []}
        />
      )}

      {phase === 'ended' && <FinalReview session={session} name={name} />}
    </QuizShell>
  )
}

function LobbyView({ code, name, quiz }) {
  return (
    <div className="flex-1 flex flex-col justify-center text-center py-10">
      <Eyebrow>You’re in</Eyebrow>
      <h1
        className="font-bold mt-2 mb-1"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 40px)' }}
      >
        {quiz.title}
      </h1>
      <p className="text-white/55 text-sm mb-8">{quiz.questions.length} questions</p>

      <Card className="text-left">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Eyebrow>Room</Eyebrow>
            <p className="text-2xl font-bold tracking-[0.2em] tabular-nums mt-1">{code}</p>
          </div>
          <div className="text-right">
            <Eyebrow>Playing as</Eyebrow>
            <p className="text-lg font-semibold mt-1 break-words">{name}</p>
          </div>
        </div>
      </Card>

      <p className="text-white/50 text-sm mt-8">Waiting for the presenter to start…</p>
    </div>
  )
}

function RevealView({ qIndex, total, question, selected, correct }) {
  const gotIt =
    selected.length === correct.length && selected.every((i) => correct.includes(i))
  const answered = selected.length > 0

  return (
    <>
      <QuestionHeader qIndex={qIndex} total={total} clock={null} />

      <div
        className={`rounded-2xl px-4 py-4 mb-5 border ${
          !answered
            ? 'border-white/15 bg-white/[0.06]'
            : gotIt
              ? 'border-emerald-400/50 bg-emerald-400/15'
              : 'border-red-400/50 bg-red-400/15'
        }`}
      >
        <p className="text-xl font-bold">
          {!answered ? 'No answer recorded' : gotIt ? 'Correct' : 'Not quite'}
        </p>
        <p className="text-white/70 text-sm mt-1 leading-snug">{question.prompt}</p>
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isCorrectOpt = correct.includes(i)
          const mine = selected.includes(i)
          const state = isCorrectOpt ? 'correct' : mine ? 'wrong' : 'muted'
          const badge = isCorrectOpt
            ? mine
              ? '✓ your pick'
              : '✓ correct'
            : mine
              ? '✗ your pick'
              : null
          return <Option key={i} index={i} label={opt} state={state} badge={badge} />
        })}
      </div>

      <p className="text-center text-white/45 text-sm mt-8">Waiting for the presenter…</p>
    </>
  )
}

function FinalReview({ session, name }) {
  const score = useMemo(() => session.scoreFor(YOU), [session])
  const [open, setOpen] = useState(null)

  return (
    <div className="py-4">
      <Eyebrow>Quiz complete</Eyebrow>
      <h1
        className="font-bold mt-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 40px)' }}
      >
        Nice work, {name}
      </h1>

      <Card className="mb-6 text-center">
        <p className="text-5xl font-bold tabular-nums">
          {score.correct}
          <span className="text-white/40 text-3xl"> / {score.total}</span>
        </p>
        <p className="text-white/55 text-sm mt-2">
          {score.percent}% · {score.wrong} wrong
          {score.blank ? ` · ${score.blank} unanswered` : ''}
        </p>
      </Card>

      <div className="flex flex-col gap-2">
        {score.results.map((r) => {
          const question = session.questions[r.index]
          const isOpen = open === r.index
          return (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.05] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.index)}
                className="w-full min-h-[52px] flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04]"
                aria-expanded={isOpen}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-lg grid place-items-center text-sm font-bold ${
                    r.status === CORRECT
                      ? 'bg-emerald-400/25 text-emerald-200'
                      : r.status === WRONG
                        ? 'bg-red-400/25 text-red-200'
                        : 'bg-white/10 text-white/50'
                  }`}
                >
                  {r.status === CORRECT ? '✓' : r.status === WRONG ? '✗' : '–'}
                </span>
                <span className="flex-1 text-sm leading-snug">
                  <span className="font-semibold">Q{r.index + 1}</span>{' '}
                  <span className="text-white/60">{question?.prompt}</span>
                </span>
                <span className="shrink-0 text-white/40 text-xs">{isOpen ? 'Hide' : 'Show'}</span>
              </button>

              {isOpen ? (
                <div className="px-4 pb-4 flex flex-col gap-2">
                  {question.options.map((opt, i) => {
                    const isCorrectOpt = r.correct.includes(i)
                    const mine = (r.selected ?? []).includes(i)
                    if (!isCorrectOpt && !mine) return null
                    return (
                      <p key={i} className="text-sm leading-snug flex gap-2">
                        <span
                          className={`font-semibold ${isCorrectOpt ? 'text-emerald-300' : 'text-red-300'}`}
                        >
                          {isCorrectOpt ? 'Correct' : 'You'} · {optionLetter(i)}
                        </span>
                        <span className="text-white/70">{opt}</span>
                      </p>
                    )
                  })}
                  {r.selected === null ? (
                    <p className="text-sm text-white/45">You didn’t answer this one.</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="block text-center min-h-[52px] leading-[52px] rounded-xl border border-white/20 font-semibold hover:bg-white/10"
        >
          Back to the course
        </Link>
      </div>
    </div>
  )
}
