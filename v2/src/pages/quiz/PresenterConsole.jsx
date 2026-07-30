/**
 * `/quiz/present/:quizId` — presenter console (spec §7.2, §7.3):
 * lobby → question → reveal → … → ended.
 *
 * Live as of Phase 3: real room code, real QR, real participants over Ably.
 * `usePresenterSession` holds the phase machine, the durable answer store and
 * the crash guard; this file is the view over it. CSV export is still Phase 6.
 *
 * Everything here is sized for a projector — bigger type and heavier weights
 * than the participant view — while keeping the same single-column layout, so
 * running the console from a laptop screen still works.
 */

import { Link, useParams } from 'react-router-dom'
import { usePresenterSession } from '../../quiz/presenterSession'
import { useCountdown, optionLetter, formatClock } from '../../quiz/display'
import { CORRECT, WRONG } from '../../quiz/scoring'
import { CONNECTED, FAILED, RECONNECTING, CONNECTING } from '../../quiz/useQuizChannel'
import AnswerDistribution from '../../quiz/AnswerDistribution'
import QrCode from '../../quiz/QrCode'
import { QuizShell, Eyebrow, PrimaryButton, SecondaryButton, Card } from '../../quiz/ui'

export default function PresenterConsole() {
  const { quizId } = useParams()
  const session = usePresenterSession(quizId)
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
    <QuizShell width="max-w-4xl">
      <ConnectionBanner session={session} />

      {phase === 'lobby' && <LobbyView session={session} onStart={controls.start} />}

      {(phase === 'question' || phase === 'reveal') && question && (
        <>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <Eyebrow>{`Question ${qIndex + 1} of ${total}`}</Eyebrow>
              <p className="text-white/50 text-sm mt-1">
                Room {session.code} ·{' '}
                {question.selections === 1 ? 'Pick 1' : `Pick ${question.selections}`}
              </p>
            </div>
            {clock === null ? null : (
              <span
                className={`shrink-0 tabular-nums font-bold rounded-full px-5 py-2 ${
                  clock === 0 ? 'bg-red-500/20 text-red-200' : 'bg-white/10'
                }`}
                style={{ fontSize: 'clamp(20px, 2.4vw, 32px)' }}
              >
                {formatClock(clock)}
              </span>
            )}
          </div>

          <h2
            className="font-semibold leading-snug mb-7"
            style={{ fontSize: 'clamp(22px, 3vw, 38px)' }}
          >
            {question.prompt}
          </h2>

          <AnswerDistribution
            options={question.options}
            counts={session.distribution}
            respondents={session.answeredCount}
            revealed={revealed}
          />

          <p className="text-white/55 mt-6" style={{ fontSize: 'clamp(15px, 1.5vw, 20px)' }}>
            <span
              className="font-bold text-white tabular-nums"
              style={{ fontSize: 'clamp(22px, 2.6vw, 34px)' }}
            >
              {session.answeredCount} / {session.presentCount}
            </span>{' '}
            answered
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sticky bottom-4">
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

/**
 * Connection state, always visible while it isn't `connected` (spec §9 — never a
 * silent hang). Deliberately not a toast: the presenter needs to be able to
 * glance at it and know whether the room is reachable.
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
          ? 'Connecting to the quiz server…'
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

function LobbyView({ session, onStart }) {
  const { quiz, participants, presentCount, code, joinUrl, wasRestored } = session

  return (
    <div className="py-2">
      <Eyebrow>Presenter console</Eyebrow>
      <h1
        className="font-bold mt-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 6vw, 48px)' }}
      >
        {quiz.title}
      </h1>

      {wasRestored ? (
        <div className="rounded-xl bg-white/10 px-4 py-3 mb-4 text-sm text-white/75">
          Restored the session that was running in this tab before the refresh.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="text-center flex flex-col justify-center">
          <Eyebrow>Room code</Eyebrow>
          <p
            className="font-bold tracking-[0.15em] tabular-nums mt-3"
            style={{ fontSize: 'clamp(56px, 11vw, 104px)', lineHeight: 1 }}
          >
            {code ?? '····'}
          </p>
          <p className="text-white/50 text-sm mt-4">
            Join at <span className="text-white/80">{shortJoinPath(joinUrl)}</span>
          </p>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-3">
          {joinUrl ? (
            <>
              <QrCode value={joinUrl} size={200} />
              <p className="text-white/45 text-xs text-center">Scan to join — code prefilled</p>
            </>
          ) : (
            <div className="w-[200px] h-[200px] rounded-lg bg-white/5" />
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <Eyebrow>{`Joined (${presentCount})`}</Eyebrow>
        {participants.length === 0 ? (
          <p className="text-white/40 text-sm mt-3">Waiting for the first participant…</p>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            {participants.map((p) => (
              <span
                key={p.clientId}
                className={`rounded-full px-4 py-2 font-medium min-h-[40px] flex items-center ${
                  p.present ? 'bg-white/10' : 'bg-white/[0.04] text-white/40'
                }`}
                style={{ fontSize: 'clamp(14px, 1.4vw, 18px)' }}
                title={p.present ? undefined : 'Disconnected — their answers still count'}
              >
                {p.name}
                {p.present ? '' : ' ·'}
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-6">
        <PrimaryButton onClick={onStart} disabled={!session.isConnected}>
          Start quiz
        </PrimaryButton>
      </div>
      <p className="text-white/35 text-xs mt-4 leading-relaxed">
        Results live in this tab only. Closing it ends the session — export the CSV first.
      </p>
    </div>
  )
}

/** `/buildfoundation-aws-2026/quiz` — the bit a participant has to type. */
function shortJoinPath(joinUrl) {
  if (!joinUrl) return '/quiz'
  try {
    return new URL(joinUrl).pathname
  } catch {
    return '/quiz'
  }
}

function ResultsView({ session }) {
  const { quiz, questions, participants } = session
  const rows = participants.map((p) => ({ participant: p, score: session.scoreFor(p.clientId) }))

  return (
    <div className="py-2">
      <Eyebrow>Results</Eyebrow>
      <h1
        className="font-bold mt-2 mb-6"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 44px)' }}
      >
        {quiz.title}
      </h1>

      {rows.length === 0 ? (
        <Card>
          <p className="text-white/60">Nobody joined this session.</p>
        </Card>
      ) : (
        /* The grid is the one place wide content is unavoidable — it scrolls
           inside its own container so the page itself never scrolls sideways. */
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-white/45 text-xs uppercase tracking-wider">
                <th className="text-left font-semibold px-4 py-3 sticky left-0 bg-[#222264]">
                  Name
                </th>
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
      )}

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
