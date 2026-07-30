/**
 * `/quiz/present` — presenter picker (spec §4).
 *
 * The passphrase gate is Phase 5; this is the unguarded picker it will sit in
 * front of. Not linked from site navigation — URL only.
 */

import { Link } from 'react-router-dom'
import { quizList } from '../../data/quizzes'
import { QuizShell, Eyebrow, Card } from '../../quiz/ui'

export default function PresenterPicker() {
  return (
    <QuizShell width="max-w-2xl">
      <div className="py-6">
        <Eyebrow>Presenter</Eyebrow>
        <h1
          className="font-bold mt-2 mb-2"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 6vw, 44px)' }}
        >
          Run a live quiz
        </h1>
        <p className="text-white/55 text-sm mb-8">
          Pick a quiz to open the console. Participants join at <span className="text-white/80">/quiz</span>.
        </p>

        <div className="flex flex-col gap-3">
          {quizList.map((meta) => (
            <Link
              key={meta.id}
              to={`/quiz/present/${meta.id}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.06] p-5 min-h-[88px] hover:bg-white/[0.11] transition-colors"
            >
              <p className="text-xl font-semibold">{meta.title}</p>
              <p className="text-white/55 text-sm mt-1 leading-snug">{meta.subtitle}</p>
              <p className="text-white/35 text-xs mt-3 uppercase tracking-widest">
                {meta.id} · {meta.defaults.timeToRespondSeconds}s per question
              </p>
            </Link>
          ))}
        </div>

        <Card className="mt-8">
          <p className="text-white/60 text-sm leading-relaxed">
            A passphrase gate lands in Phase 5. Note that it is a client-side check on a static
            site — it stops casual snooping, not anyone reading the bundle (spec §8).
          </p>
        </Card>
      </div>
    </QuizShell>
  )
}
