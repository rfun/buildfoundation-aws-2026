import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import slidesData from '../data/slides/index.js'
import SlideRenderer from '../components/SlideRenderer.jsx'
import { createDeckChannel } from '../deckSync.js'
import { projectFile, projectFileUrl } from '../data/projectFile.js'

export default function SlideViewer() {
  const { weekNum } = useParams()
  const [searchParams] = useSearchParams()
  const isAdmin = searchParams.get('admin') === 'true'
  const week = parseInt(weekNum, 10)
  const weekData = slidesData[week]

  const TOTAL = weekData?.slides?.length || 0
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
  const notesRef = useRef(null)

  const go = useCallback((delta) => {
    setDirection(delta)
    setCurrent((c) => Math.max(0, Math.min(TOTAL - 1, c + delta)))
  }, [TOTAL])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Scroll notes to top on slide change
  useEffect(() => {
    if (notesRef.current) notesRef.current.scrollTop = 0
  }, [current])

  // ── Sync with the presenter-notes window ──────────────────────────────────
  // Declared before the broadcast effect below so the channel exists by the
  // time that one fires on mount.
  const channelRef = useRef(null)
  // Mirrors `current` so the channel's message handler — which is registered
  // once — always reads the live value instead of a stale closure.
  const currentRef = useRef(0)
  useEffect(() => { currentRef.current = current }, [current])

  useEffect(() => {
    if (!weekData) return
    const ch = createDeckChannel(week)
    if (!ch) return
    channelRef.current = ch

    ch.onmessage = (e) => {
      const msg = e.data
      // The notes window just opened and wants to know where we are.
      if (msg?.type === 'request') {
        ch.postMessage({ type: 'slide', index: currentRef.current, total: TOTAL })
      }
      // The presenter advanced from the notes window.
      if (msg?.type === 'goto' && Number.isInteger(msg.index)) {
        const next = Math.max(0, Math.min(TOTAL - 1, msg.index))
        setDirection(next >= currentRef.current ? 1 : -1)
        setCurrent(next)
      }
    }

    return () => {
      ch.close()
      channelRef.current = null
    }
  }, [week, TOTAL, weekData])

  // Broadcast our position whenever it changes.
  useEffect(() => {
    channelRef.current?.postMessage({ type: 'slide', index: current, total: TOTAL })
  }, [current, TOTAL])

  if (!weekData) {
    return (
      <div className="min-h-screen bg-[#1e1e6e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Week {week} not found</p>
          <Link to="/" className="text-[#c4aaff] text-sm hover:text-white transition-colors">← Back to home</Link>
        </div>
      </div>
    )
  }

  const currentNote = weekData.slides?.[current]?.note ?? null

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.25 } }),
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1a1a2e] relative" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Slide area — full-bleed */}
      <div
        className="absolute inset-0"
        onClick={(e) => {
          const x = e.clientX
          const mid = window.innerWidth / (isAdmin ? 1.5 : 1) / 2
          go(x > mid ? 1 : -1)
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <SlideRenderer
              slide={weekData.slides?.[current]}
              weekNum={week}
              slideIndex={current}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back to home — floating pill, top-left */}
      <div className="fixed top-[30px] left-10 z-[1001] flex items-center gap-2.5">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-white/90 text-sm font-medium bg-[#2d2d7a]/85 border-2 border-white/30 rounded-lg px-5 py-2.5 backdrop-blur-md transition-colors hover:bg-[#1e1e5a]/95 hover:border-[#f5a623]"
        >
          ← Back to Home
        </Link>
        {/* Project deck download — only on the week that hands out the project */}
        {week === projectFile.week && (
          <a
            href={projectFileUrl()}
            download
            onClick={(e) => e.stopPropagation()}
            title={`${projectFile.description} (${projectFile.size})`}
            className="inline-flex items-center gap-1.5 text-white/90 text-sm font-medium bg-[#2d2d7a]/85 border-2 border-white/30 rounded-lg px-5 py-2.5 backdrop-blur-md no-underline transition-colors hover:bg-[#1e1e5a]/95 hover:border-[#f5a623]"
          >
            ↓ {projectFile.label}
          </a>
        )}
      </div>

      {isAdmin && (
        <div className="fixed top-[30px] right-10 z-[1001] flex items-center gap-2.5">
          {/* Opens the week's notes in a second window — sized for a laptop screen
              while the deck itself is on the shared display. */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `${import.meta.env.BASE_URL}week/${week}/notes`,
                `notes-week-${week}`,
                'width=900,height=1000,noopener',
              )
            }}
            className="bg-[#2d2d7a]/85 border-2 border-white/30 text-white/90 text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-md transition-colors hover:bg-[#1e1e5a]/95 hover:border-[#f5a623]"
          >
            Notes ↗
          </button>
          <span className="bg-[#c4aaff]/20 border border-[#c4aaff]/30 text-[#c4aaff] text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
            Admin
          </span>
        </div>
      )}

      {/* Bottom nav — floating overlay, matches original deck chrome */}
      <div className="fixed bottom-[30px] left-0 right-0 flex items-center justify-between px-10 z-[1000] pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); go(-1) }}
          disabled={current === 0}
          className="pointer-events-auto bg-[#2d2d7a]/85 text-white border-2 border-white/30 px-7 py-3 rounded-lg text-base font-medium backdrop-blur-md transition-all hover:bg-[#1e1e5a]/95 hover:border-[#f5a623] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2d2d7a]/85 disabled:hover:border-white/10"
        >
          ← Back
        </button>

        <span className="pointer-events-auto text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md tabular-nums">
          {current + 1} / {TOTAL}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); go(1) }}
          disabled={current === TOTAL - 1}
          className="pointer-events-auto bg-[#2d2d7a]/85 text-white border-2 border-white/30 px-7 py-3 rounded-lg text-base font-medium backdrop-blur-md transition-all hover:bg-[#1e1e5a]/95 hover:border-[#f5a623] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#2d2d7a]/85 disabled:hover:border-white/10"
        >
          Next →
        </button>
      </div>

      {/* Presenter notes panel — admin only */}
      {isAdmin && (
        <motion.aside
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-[100px] left-10 right-10 max-h-[200px] overflow-y-auto bg-[#2d2d7a]/95 border-2 border-white/20 rounded-lg px-7 py-5 backdrop-blur-md z-[999]"
          ref={notesRef}
        >
          <p className="text-[#f5a623] text-xs uppercase tracking-[0.2em] font-semibold mb-2">
            Presenter Notes · Slide {current + 1} of {TOTAL}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {currentNote ? (
                <p className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{currentNote}</p>
              ) : (
                <p className="text-white/40 text-sm italic">No notes for this slide.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      )}
    </div>
  )
}
