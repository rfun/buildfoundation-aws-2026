/**
 * `/quiz/present/:quizId` — presenter console (spec §7.2, §7.3):
 * lobby → question → reveal → … → results + export.
 *
 * Phase 1 is `useMockSession` with a fake roster. Phase 3 replaces the state
 * source and the chart placeholder; Phase 6 fills in CSV export.
 *
 * Projected legibility: larger type and higher contrast than the participant
 * view, but the same single-column layout.
 */

import { Link, useParams } from 'react-router-dom'
import { useMockSession, useCountdown, optionLetter, formatClock } from '../../quiz/mockSession'
import { CORRECT, WRONG } from '../../quiz/scoring'
import { QuizShell, Eyebrow, PrimaryButton, SecondaryButton, Card } from '../../quiz/ui'

/** Phase 3 derives this from the passphrase + a session nonce (spec §8). */
const MOCK_ROOM_CODE = '4821'

export default function PresenterConsole() {
  const { quizId } = useParams()
  const session = useMockSession(quizId, { withRoster: true })
  const { quiz, error, phase, qIndex, question, total, endsAt, revealedCorrect, controls } = session
  const clock = useCountdown(endsAt)

  if (error) {
    return (
      <QuizShell width="max-w-2xl">
        <Card className="my-auto text-center">
          <p className="font-semibold mb-2">Couldn’t load that quiz</p>
          <p className="text-white/60 text-sm mb-4">{error}</p>
          <Link to="/quiz/present" className="text-[#c4aaff] font-semibold text-sm underline">
            Back to quiz list
          </Link>
        </Card>
      </QuizShell>
    )
  }

  if (!quiz) {
    return (
      <QuizShell width="max-w-2xl">
        <p className="my-auto text-center text-white/50">Loading…</p>
      </QuizShell>
    )
  }

  const revealed = revealedCorrect[qIndex] ?? null

  return (
    <QuizShell width="max-w-3xl">
      {phase === 'lobby' && <LobbyView session={session} onStart={controls.start} />}

      {(phase === 'question' || phase === 'reveal') && question && (
        <>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <Eyebrow>{`Question ${qIndex + 1} of ${total}`}</Eyebrow>
              <p className="text-white/50 text-sm mt-1">
                Room {MOCK_ROOM_CODE} · {question.selections === 1 ? 'Pick 1' : `Pick ${question.selections}`}
              </p>
            </div>
            {clock === null ? null : (
              <span
                className={`shrink-0 tabular-nums font-bold rounded-full px-4 py-2 text-xl ${
                  clock === 0 ? 'bg-red-500/20 text-red-200' : 'bg-white/10'
                }`}
              >
                {formatClock(clock)}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold leading-snug mb-6">{question.prompt}</h2>

          <DistributionPlaceholder
            options={question.options}
            counts={session.distribution}
            totalAnswered={session.answeredCount}
            revealed={revealed}
          />

          <p className="text-white/60 text-base mt-5">
            <span className="font-bold text-white text-xl tabular-nums">
              {session.answeredCount} / {session.participants.length}
            </span>{' '}
            answered
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sticky bottom-4">
            <SecondaryButton
              className="flex-1"
              onClick={controls.reveal}
              disabled={phase === 'reveal'}
            >
              Reveal
            </SecondaryButton>
            <PrimaryButton className="flex-1" onClick={controls.next} disabled={phase !== 'reveal'}>
              {qIndex + 1 >= total ? 'Finish →' : 'Next →'}
            </PrimaryButton>
          </div>
        </>
      )}

      {phase === 'ended' && <ResultsView session={session} />}
    </QuizShell>
  )
}

function LobbyView({ session, onStart }) {
  const { quiz, participants } = session
  return (
    <div className="py-4">
      <Eyebrow>Presenter console</Eyebrow>
      <h1
        className="font-bold mt-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 6vw, 48px)' }}
      >
        {quiz.title}
      </h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="text-center">
          <Eyebrow>Room code</Eyebrow>
          <p className="text-6xl font-bold tracking-[0.15em] tabular-nums mt-3">{MOCK_ROOM_CODE}</p>
          <p className="text-white/45 text-sm mt-3">Join at /quiz</p>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <div className="w-36 h-36 rounded-xl border-2 border-dashed border-white/25 grid place-items-center text-center px-3">
            <span className="text-white/40 text-xs leading-snug">QR code — Phase 3</span>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <Eyebrow>{`Joined (${participants.length})`}</Eyebrow>
        <div className="flex flex-wrap gap-2 mt-3">
          {participants.map((p) => (
            <span
              key={p.clientId}
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium min-h-[36px] flex items-center"
            >
              {p.name}
            </span>
          ))}
        </div>
      </Card>

      <div className="mt-6">
        <PrimaryButton onClick={onStart}>Start quiz</PrimaryButton>
      </div>
      <p className="text-white/35 text-xs mt-4">
        Participants shown are mock data until the Ably transport lands (Phase 2).
      </p>
    </div>
  )
}

/**
 * Placeholder for the live answer-distribution chart.
 * Phase 3 replaces this with a real bar chart built under the `dataviz` skill —
 * deliberately unstyled-as-a-chart here so it can’t be mistaken for finished.
 */
function DistributionPlaceholder({ options, counts, totalAnswered, revealed }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-white/20 p-4">
      <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
        Answer distribution — bar chart in Phase 3
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const isCorrect = revealed?.includes(i)
          return (
            <div
              key={i}
              className={`flex items-center gap-3 text-base ${
                revealed ? (isCorrect ? 'text-emerald-300' : 'text-red-300/70') : 'text-white/80'
              }`}
            >
              <span className="w-7 h-7 shrink-0 rounded-lg bg-white/10 grid place-items-center text-sm font-bold">
                {optionLetter(i)}
              </span>
              <span className="flex-1 leading-snug">{opt}</span>
              <span className="tabular-nums font-bold shrink-0">{counts[i] ?? 0}</span>
            </div>
          )
        })}
      </div>
      <p className="text-white/30 text-xs mt-3">{totalAnswered} responses</p>
    </div>
  )
}

function ResultsView({ session }) {
  const { quiz, questions, participants } = session
  const rows = participants.map((p) => ({ participant: p, score: session.scoreFor(p.clientId) }))

  return (
    <div className="py-4">
      <Eyebrow>Results</Eyebrow>
      <h1
        className="font-bold mt-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 44px)' }}
      >
        {quiz.title}
      </h1>

      {/* The grid is the one place wide content is unavoidable — it scrolls
          inside its own container so the page itself never scrolls sideways. */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-white/45 text-xs uppercase tracking-wider">
              <th className="text-left font-semibold px-4 py-3 sticky left-0 bg-[#222264]">Name</th>
              {questions.map((q, i) => (
                <th key={q.id} className="px-2 py-3 font-semibold tabular-nums">
                  {i + 1}
                </th>
              ))}
              <th className="px-4 py-3 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ participant, score }) => (
              <tr key={participant.clientId} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium whitespace-nowrap sticky left-0 bg-[#222264]">
                  {participant.name}
                </td>
                {score.results.map((r) => (
                  <td key={r.id} className="px-2 py-3 text-center">
                    <span
                      className={
                        r.status === CORRECT
                          ? 'text-emerald-300 font-bold'
                          : r.status === WRONG
                            ? 'text-red-300 font-bold'
                            : 'text-white/25'
                      }
                    >
                      {r.selected ? r.selected.map(optionLetter).join('') : '–'}
                    </span>
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-bold tabular-nums whitespace-nowrap">
                  {score.correct}/{score.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <PrimaryButton className="flex-1" disabled title="CSV export lands in Phase 6">
          Export CSV — Phase 6
        </PrimaryButton>
        <SecondaryButton className="flex-1" onClick={session.controls.reset}>
          New session
        </SecondaryButton>
      </div>
    </div>
  )
}
