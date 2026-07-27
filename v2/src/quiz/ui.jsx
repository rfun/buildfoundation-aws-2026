/**
 * Shared quiz UI primitives.
 *
 * Mobile-first: one column, tap targets ≥44px, and a `max-width` cap so the same
 * layout simply scales up on a laptop rather than sprawling (spec §7.1).
 */

import { optionLetter } from './mockSession'

/** Page frame: dark navy field, centred column, safe-area padding. */
export function QuizShell({ children, width = 'max-w-xl', footer = null }) {
  return (
    <div className="min-h-screen bg-[#14145a] text-white flex flex-col">
      <div
        className="flex-1 w-full mx-auto px-4 py-6 sm:px-6 sm:py-10 flex flex-col"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <div className={`w-full mx-auto flex-1 flex flex-col ${width}`}>{children}</div>
      </div>
      {footer}
    </div>
  )
}

/** Small uppercase label above a block. */
export function Eyebrow({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{children}</p>
  )
}

/** `Q4 of 13` + countdown, as a single row. */
export function QuestionHeader({ qIndex, total, clock, hint }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div>
        <Eyebrow>{`Question ${qIndex + 1} of ${total}`}</Eyebrow>
        {hint ? <p className="text-white/70 text-sm mt-1">{hint}</p> : null}
      </div>
      {clock === null ? null : (
        <span
          className={`shrink-0 tabular-nums font-semibold rounded-full px-3 py-1.5 text-sm ${
            clock === 0 ? 'bg-red-500/20 text-red-200' : 'bg-white/10 text-white'
          }`}
        >
          {`0:${String(clock % 60).padStart(2, '0')}`}
        </span>
      )}
    </div>
  )
}

const STATE_STYLES = {
  idle: 'border-white/15 bg-white/[0.06] hover:bg-white/[0.12]',
  selected: 'border-[#c4aaff] bg-[#c4aaff]/20',
  correct: 'border-emerald-400 bg-emerald-400/20',
  wrong: 'border-red-400 bg-red-400/20',
  muted: 'border-white/10 bg-white/[0.03] text-white/55',
}

/**
 * One answer option. Renders as a button while answering and as a static row
 * during reveal/review — same shape either way so nothing shifts on transition.
 */
export function Option({ index, label, state = 'idle', onClick, disabled, badge }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[56px] flex items-start gap-3 text-left rounded-xl border px-4 py-3 transition-colors ${
        STATE_STYLES[state]
      } ${disabled && onClick ? 'opacity-60 cursor-not-allowed' : ''} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <span className="shrink-0 w-7 h-7 rounded-lg bg-white/10 grid place-items-center text-sm font-bold mt-0.5">
        {optionLetter(index)}
      </span>
      <span className="flex-1 text-[15px] leading-snug pt-1">{label}</span>
      {badge ? <span className="shrink-0 text-xs font-semibold pt-1.5">{badge}</span> : null}
    </Tag>
  )
}

/** Full-width primary action. 52px tall — comfortably over the 44px minimum. */
export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full min-h-[52px] rounded-xl bg-[#6666dd] text-white font-semibold text-base px-5 transition-colors hover:bg-[#5c5ce0] disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`min-h-[52px] rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-base px-5 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Phase 1 only: a strip that drives the mock presenter state from the
 * participant view, so every phase is reachable without a second tab.
 * Deleted when Phase 2 wires up the real channel.
 */
export function MockControls({ items }) {
  return (
    <div className="border-t border-white/10 bg-black/30 backdrop-blur">
      <div className="max-w-xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-white/35 mr-1">Mock presenter</span>
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            disabled={item.disabled}
            className="min-h-[44px] rounded-lg border border-white/15 px-3 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
