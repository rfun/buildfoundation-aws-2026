/**
 * `/quiz` — participant join (spec §7.1). Default landing for the QR code, which
 * arrives with `?code=` already filled in so a phone only has to type a name.
 *
 * The code is not validated here — there is no server to validate it against.
 * Anything four digits opens `/quiz/room/<code>`; a wrong code lands in an empty
 * Ably channel where nothing ever arrives, and the room screen says as much.
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { rememberName, recallName } from '../../quiz/participantSession'
import { QuizShell, Eyebrow, PrimaryButton, Card } from '../../quiz/ui'

export default function QuizJoin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [code, setCode] = useState(params.get('code') ?? '')
  // Prefilled if this tab has already joined once — someone who backs out to
  // re-scan the QR shouldn't have to retype their name.
  const [name, setName] = useState(() => recallName())

  const codeOk = /^\d{4}$/.test(code)
  const nameOk = name.trim().length > 0
  const ready = codeOk && nameOk

  const join = (e) => {
    e.preventDefault()
    if (!ready) return
    const trimmed = name.trim()
    // Kept alongside the `clientId` in `sessionStorage` so a refresh of the room
    // rejoins as the same person, under the same name (spec §6, §9).
    rememberName(trimmed)
    navigate(`/quiz/room/${code}?name=${encodeURIComponent(trimmed)}`)
  }

  const field =
    'w-full min-h-[52px] rounded-xl border border-white/15 bg-white/[0.06] px-4 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-[#c4aaff] focus:bg-white/10'

  return (
    <QuizShell width="max-w-md">
      <div className="flex-1 flex flex-col justify-center py-8">
        <Eyebrow>The Build Fellowship</Eyebrow>
        <h1
          className="text-white font-bold leading-tight mt-2 mb-8"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 7vw, 44px)' }}
        >
          Join the live quiz
        </h1>

        <Card>
          <form onSubmit={join} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white/70">Room code</span>
              <input
                className={`${field} tracking-[0.4em] text-center text-2xl font-bold`}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                inputMode="numeric"
                autoComplete="off"
                placeholder="0000"
                aria-label="Room code"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white/70">Your name</span>
              <input
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                autoComplete="name"
                placeholder="e.g. Rohit"
                aria-label="Your name"
              />
            </label>

            <PrimaryButton type="submit" disabled={!ready}>
              Join
            </PrimaryButton>
          </form>
        </Card>

        <p className="text-white/40 text-xs mt-5 leading-relaxed">
          Your name is shown to the presenter alongside your answers. No account, no email — nothing
          is stored after the session ends.
        </p>
      </div>
    </QuizShell>
  )
}
