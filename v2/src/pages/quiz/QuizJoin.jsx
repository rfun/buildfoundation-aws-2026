/**
 * `/quiz` — participant join (spec §7.1). Default landing for the QR code.
 *
 * Phase 1: the code is not validated against a live room; anything 4 digits
 * navigates through to the mocked room.
 */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QuizShell, Eyebrow, PrimaryButton, Card } from '../../quiz/ui'

export default function QuizJoin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [code, setCode] = useState(params.get('code') ?? '')
  const [name, setName] = useState('')

  const codeOk = /^\d{4}$/.test(code)
  const nameOk = name.trim().length > 0
  const ready = codeOk && nameOk

  const join = (e) => {
    e.preventDefault()
    if (!ready) return
    navigate(`/quiz/room/${code}?name=${encodeURIComponent(name.trim())}`)
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
