/**
 * `/quiz/room/:code` — participant play (spec §7.1):
 * waiting → question → reveal → final review.
 *
 * Live as of Phase 4: the presenter drives every transition over Ably.
 * `useParticipantSession` owns the state; this file is the view over it.
 *
 * The presenter is the only clock. Nothing here advances on its own — not even
 * when the countdown hits zero, which locks the input and then waits (spec §6:
 * "Timer expiry does not auto-advance"). That is deliberate: it leaves the
 * presenter free to talk through a question for as long as the room needs.
 */

import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useParticipantSession, recallName } from '../../quiz/participantSession'
import { useCountdown, optionLetter } from '../../quiz/display'
import { CORRECT, WRONG } from '../../quiz/scoring'
import { CONNECTED, FAILED, RECONNECTING, CONNECTING } from '../../quiz/useQuizChannel'
import { QuizShell, Eyebrow, QuestionHeader, Option, PrimaryButton, Card } from '../../quiz/ui'

export default function QuizRoom() {
  const { code } = useParams()
  const [params] = useSearchParams()
  // The query param is the normal path in; `recallName()` covers a refresh that
  // lost it (a shared link, a browser that stripped the query).
  const name = params.get('name') || recallName() || 'You'

  const session = useParticipantSession(code, name)
  const { quiz, error, phase, qIndex, question, total, revealed, ended } = session

  const clock = useCountdown(session.endsAt)
  const timeUp = clock === 0
  const sent = session.answers[qIndex] ?? []

  // The answer pad. Starts from whatever was already sent for this question, so
  // a reconnect or a re-render shows the answer that is actually recorded.
  const [draft, setDraft] = useState(sent)
  const [draftFor, setDraftFor] = useState(qIndex)

  // New question → reset the pad. Adjusting state during render is the supported
  // way to react to a changed prop-like value without an extra render pass.
  if (draftFor !== qIndex) {
    setDraftFor(qIndex)
    setDraft(sent)
  }

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

  const needed = question?.selections ?? 1
  // Input is live only while the question is open and the timer has not run out.
  const locked = phase !== 'question' || timeUp

  const toggle = (i) => {
    if (locked) return
    setDraft((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i)
      if (needed === 1) return [i]
      // At the limit, the oldest pick drops out — tapping a third option on a
      // "Choose TWO" swaps rather than doing nothing, which is what people expect.
      if (prev.length >= needed) return [...prev.slice(1), i]
      return [...prev, i]
    })
  }

  const submit = () => {
    if (draft.length !== needed || locked) return
    session.submitAnswer(qIndex, draft)
  }

  // "Submitted" is not its own state — it is just the pad matching what was sent.
  const submitted =
    sent.length > 0 && sent.length === draft.length && sent.every((i) => draft.includes(i))

  // No `state` yet means the presenter hasn't answered our `sync` — we are in the
  // room but don't know where the quiz is.
  const waiting = phase === null || phase === 'lobby'

  return (
    <QuizShell width="max-w-xl">
      <ConnectionBanner session={session} />

      {ended ? (
        <FinalReview session={session} name={name} />
      ) : waiting ? (
        <WaitingView code={code} name={name} quiz={quiz} />
      ) : !question ? (
        <p className="my-auto text-center text-white/50">Loading the quiz…</p>
      ) : phase === 'question' ? (
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
            <PrimaryButton
              onClick={submit}
              disabled={draft.length !== needed || locked}
              data-testid="submit"
            >
              {timeUp
                ? 'Time’s up'
                : submitted
                  ? 'Answer sent — tap to change'
                  : draft.length === needed
                    ? 'Submit'
                    : `Select ${needed - draft.length} more`}
            </PrimaryButton>
            <p className="text-center text-white/45 text-xs mt-2">
              {timeUp
                ? sent.length > 0
                  ? 'Your answer is in. Waiting for the presenter…'
                  : 'Waiting for the presenter…'
                : submitted
                  ? 'You can change your answer until the presenter reveals.'
                  : ' '}
            </p>
          </div>
        </>
      ) : (
        <RevealView
          qIndex={qIndex}
          total={total}
          question={question}
          selected={sent}
          correct={revealed[qIndex] ?? []}
        />
      )}
    </QuizShell>
  )
}

/**
 * Connection state, shown whenever it isn't `connected` (spec §9 — never a
 * silent hang). On a phone this is the only way to tell "the presenter hasn't
 * started yet" apart from "your wifi dropped".
 */
function ConnectionBanner({ session }) {
  const { connection, connectionError, retry } = session
  if (connection === CONNECTED) return null

  const copy =
    connection === FAILED
      ? (connectionError ?? 'Can’t reach the quiz server.')
      : connection === RECONNECTING
        ? 'Reconnecting…'
        : connection === CONNECTING
          ? 'Connecting…'
          : connection

  return (
    <div
      className={`rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3 text-sm font-semibold ${
        connection === FAILED ? 'bg-red-500/20 text-red-100' : 'bg-amber-400/15 text-amber-100'
      }`}
      role="status"
    >
      <span>{copy}</span>
      {connection === FAILED ? (
        <button
          type="button"
          onClick={retry}
          className="shrink-0 min-h-[36px] rounded-lg border border-white/25 px-3 hover:bg-white/10"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}

/** In the room, waiting on the presenter — before the quiz starts, or between us. */
function WaitingView({ code, name, quiz }) {
  return (
    <div className="flex-1 flex flex-col justify-center text-center py-10">
      <Eyebrow>You’re in</Eyebrow>
      <h1
        className="font-bold mt-2 mb-1"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 40px)' }}
      >
        {quiz?.title ?? 'Live quiz'}
      </h1>
      <p className="text-white/55 text-sm mb-8">
        {quiz ? `${quiz.questions.length} questions` : 'Waiting for the room…'}
      </p>

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

/**
 * Reveal (spec §7.1, required): whether they were right, and which option was
 * correct. Every one of their picks is marked individually, so on a "Choose TWO"
 * they can see they got one of the two rather than just "wrong".
 */
function RevealView({ qIndex, total, question, selected, correct }) {
  const answered = selected.length > 0
  const gotIt =
    answered && selected.length === correct.length && selected.every((i) => correct.includes(i))
  // Multi-select is all-or-nothing (spec §5), but "you had one of two" is still
  // worth saying — it is the difference between a near miss and a guess.
  const partial = !gotIt && answered && selected.some((i) => correct.includes(i))

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
        {partial ? (
          <p className="text-white/75 text-sm mt-1">
            You had {selected.filter((i) => correct.includes(i)).length} of {correct.length} — this
            one needs both to count.
          </p>
        ) : null}
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

/**
 * Final review (spec §7.1, required). Computed locally in `useParticipantSession`
 * from this client's own answers plus the reveals it received — the presenter is
 * not asked for a score, and a question this person never answered reads blank
 * rather than wrong, so joining at Q7 costs nothing but the questions missed.
 */
function FinalReview({ session, name }) {
  const { score, questions } = session
  const [open, setOpen] = useState(null)

  const answeredTotal = score.correct + score.wrong

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
        {score.blank > 0 && answeredTotal > 0 ? (
          <p className="text-white/45 text-xs mt-3 leading-relaxed">
            Unanswered questions aren’t counted as wrong — you got {score.correct} of the{' '}
            {answeredTotal} you answered.
          </p>
        ) : null}
      </Card>

      <div className="flex flex-col gap-2">
        {score.results.map((r) => {
          const question = questions[r.index]
          const isOpen = open === r.index
          return (
            <div
              key={r.id}
              className="rounded-xl border border-white/10 bg-white/[0.05] overflow-hidden"
            >
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
                          className={`font-semibold shrink-0 ${
                            isCorrectOpt ? 'text-emerald-300' : 'text-red-300'
                          }`}
                        >
                          {isCorrectOpt ? (mine ? 'Correct · you' : 'Correct') : 'You'} ·{' '}
                          {optionLetter(i)}
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
