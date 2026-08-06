import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import slidesData from '../data/slides/index.js'
import { createDeckChannel } from '../deckSync.js'

// A slide's data has no single "name" field — each layout carries its heading
// under a different key. Fall back through them so every row gets a label the
// presenter can match against what's on the shared screen.
function slideLabel(slide, index) {
  const c = slide?.content ?? {}
  return c.title ?? c.calloutTitle ?? c.ariaLabel ?? `Slide ${index + 1}`
}

function slideSubLabel(slide) {
  const c = slide?.content ?? {}
  return c.subtitle ?? c.sectionSubtitle ?? null
}

// Strip the `slide-` prefix for a compact chip: 'slide-section-dark' → 'section dark'
function typeLabel(type) {
  return (type ?? '').replace(/^slide-/, '').replace(/-/g, ' ')
}

export default function PresenterNotes() {
  const { weekNum } = useParams()
  const week = parseInt(weekNum, 10)
  const weekData = slidesData[week]
  const slides = weekData?.slides ?? []

  // null until the deck window tells us where it is.
  const [current, setCurrent] = useState(null)
  const [following, setFollowing] = useState(true)
  const channelRef = useRef(null)
  const rowRefs = useRef([])

  useEffect(() => {
    if (!weekData) return
    const ch = createDeckChannel(week)
    if (!ch) return
    channelRef.current = ch

    ch.onmessage = (e) => {
      if (e.data?.type === 'slide') setCurrent(e.data.index)
    }
    // The deck may already be mid-presentation — ask where it is.
    ch.postMessage({ type: 'request' })

    return () => {
      ch.close()
      channelRef.current = null
    }
  }, [week, weekData])

  // Keep the active note in view, unless the presenter has paused following to
  // read ahead.
  useEffect(() => {
    if (!following || current == null) return
    rowRefs.current[current]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [current, following])

  // Drive the deck from this window. Without this you'd have to click back to
  // the deck window to advance, which defeats the point of a second screen.
  const goto = useCallback(
    (index) => {
      if (index < 0 || index >= slides.length) return
      channelRef.current?.postMessage({ type: 'goto', index })
      setFollowing(true)
    },
    [slides.length],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (current == null) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goto(current + 1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goto(current - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goto])

  if (!weekData) {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Week {week} not found</p>
          <Link to="/" className="text-[#c4aaff] text-sm hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  const connected = current != null
  const withNotes = slides.filter((s) => s.note).length

  return (
    <div
      className="min-h-screen bg-[#1a1a2e] text-white print:bg-white print:text-black"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Sticky header so position and controls stay visible while scrolling */}
      <header className="sticky top-0 z-10 bg-[#1e1e6e]/95 backdrop-blur-md border-b border-white/15 px-8 py-5 print:static print:bg-white print:border-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between gap-6 flex-wrap">
            <div>
              <p className="text-[#f5a623] text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                Presenter Notes · Week {week}
              </p>
              <h1
                className="text-2xl font-bold leading-snug print:text-black"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {weekData.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/50 tabular-nums print:text-black/60">
                {withNotes} of {slides.length} slides have notes
              </span>
              <button
                onClick={() => window.print()}
                className="print:hidden text-white/80 border border-white/25 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:border-[#f5a623] hover:text-white"
              >
                Print
              </button>
              <Link
                to={`/week/${week}`}
                className="print:hidden text-[#c4aaff] text-xs hover:text-white transition-colors"
              >
                Open deck →
              </Link>
            </div>
          </div>

          {/* Sync status + remote control */}
          <div className="print:hidden flex items-center gap-3 mt-4 flex-wrap">
            <span
              className={`inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1.5 border ${
                connected
                  ? 'bg-[#4db6ac]/15 border-[#4db6ac]/40 text-[#4db6ac]'
                  : 'bg-white/5 border-white/20 text-white/45'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#4db6ac]' : 'bg-white/40'}`}
              />
              {connected ? `Slide ${current + 1} of ${slides.length}` : 'Waiting for the deck window…'}
            </span>

            <button
              onClick={() => goto(current - 1)}
              disabled={!connected || current === 0}
              className="bg-[#2d2d7a]/85 border border-white/25 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:border-[#f5a623] disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-white/25"
            >
              ← Back
            </button>
            <button
              onClick={() => goto(current + 1)}
              disabled={!connected || current === slides.length - 1}
              className="bg-[#2d2d7a]/85 border border-white/25 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:border-[#f5a623] disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-white/25"
            >
              Next →
            </button>

            <button
              onClick={() => setFollowing((f) => !f)}
              disabled={!connected}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors disabled:opacity-25 disabled:cursor-not-allowed ${
                following
                  ? 'bg-[#c4aaff]/15 border-[#c4aaff]/40 text-[#c4aaff]'
                  : 'bg-white/5 border-white/25 text-white/60'
              }`}
              title="When on, this window scrolls to whichever slide the deck is showing"
            >
              {following ? 'Auto-scroll on' : 'Auto-scroll off'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-8">
        {!connected && (
          <p className="text-white/35 text-xs mb-8 print:hidden">
            Open <span className="text-white/60">/week/{week}</span> in another window and this
            will follow along. Until then, all notes are listed below.
          </p>
        )}

        <ol className="space-y-5">
          {slides.map((slide, i) => {
            const sub = slideSubLabel(slide)
            const active = i === current
            return (
              <li
                key={i}
                ref={(el) => { rowRefs.current[i] = el }}
                className={`grid grid-cols-[3rem_1fr] gap-4 border-b pb-5 -mx-4 px-4 rounded-lg transition-colors print:border-black/15 print:break-inside-avoid print:bg-transparent ${
                  active
                    ? 'bg-[#2d2d7a]/60 border-[#f5a623]/40'
                    : `border-white/10 ${connected ? 'opacity-45' : ''}`
                }`}
              >
                <span
                  className={`text-2xl font-bold tabular-nums leading-none pt-0.5 print:text-black ${
                    active ? 'text-[#f5a623]' : 'text-white/45'
                  }`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {i + 1}
                </span>

                <div>
                  <div className="flex items-baseline gap-2.5 flex-wrap mb-1.5">
                    <h2 className="text-white font-semibold leading-snug print:text-black">
                      {slideLabel(slide, i)}
                    </h2>
                    <span className="text-[#c4aaff]/60 text-[10px] uppercase tracking-wider border border-[#c4aaff]/25 rounded-full px-2 py-0.5 print:text-black/50 print:border-black/25">
                      {typeLabel(slide.type)}
                    </span>
                  </div>

                  {sub && (
                    <p className="text-white/40 text-xs italic mb-2 print:text-black/50">{sub}</p>
                  )}

                  {slide.note ? (
                    <p className="text-white/85 text-[15px] leading-relaxed whitespace-pre-wrap print:text-black">
                      {slide.note}
                    </p>
                  ) : (
                    <p className="text-white/25 text-sm italic print:text-black/40">
                      No notes for this slide.
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}
