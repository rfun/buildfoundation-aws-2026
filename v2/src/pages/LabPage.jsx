import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import labs from '../data/labs.js'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
})

export default function LabPage() {
  const { labId } = useParams()
  const lab = labs[labId]

  if (!lab) {
    return (
      <div className="min-h-screen bg-[#f0eeff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1e1e6e]/40 text-sm mb-4">Lab not found</p>
          <Link to="/" className="text-[#5c5ce0] text-sm hover:text-[#1e1e6e] transition-colors">← Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0eeff]">
      {/* Hero header */}
      <div className="bg-[#1e1e6e] pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e6e] via-[#2a2a8a] to-[#3b35cc] opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: lab.pillarColor + '15' }} />

        <div className="max-w-4xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Labs
          </Link>

          {/* Pillar badge */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
              style={{ background: lab.pillarColor }}
            >
              {lab.pillar}
            </span>
            <span className="text-white/30 text-xs">{lab.weekTieIn}</span>
          </div>

          <motion.h1
            {...fadeUp(0)}
            className="text-white font-bold mb-4 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            Lab {lab.num}: {lab.title}
          </motion.h1>

          {/* Meta */}
          <motion.div {...fadeUp(1)} className="flex flex-wrap gap-5 text-white/50 text-sm">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lab.time}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Free Tier
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AWS Console Only
            </span>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Overview */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Overview</SectionLabel>
          <p className="text-[#1e1e6e]/70 leading-relaxed text-base">{lab.overview}</p>
        </motion.section>

        {/* Career Connection */}
        {lab.careerConnection && (
          <motion.section {...fadeUp(0)}>
            <div
              className="rounded-xl p-5 border-l-4"
              style={{ background: `${lab.pillarColor}10`, borderColor: lab.pillarColor }}
            >
              <p className="text-[#1e1e6e]/70 text-sm leading-relaxed">
                <span className="font-semibold" style={{ color: lab.pillarColor }}>Career connection: </span>
                {lab.careerConnection}
              </p>
            </div>
          </motion.section>
        )}

        {/* Objectives + Prerequisites side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section {...fadeUp(0)}>
            <SectionLabel>Objectives</SectionLabel>
            <ul className="space-y-3">
              {lab.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: lab.pillarColor }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[#1e1e6e]/70 text-sm leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section {...fadeUp(1)}>
            <SectionLabel>Prerequisites</SectionLabel>
            <div className="bg-white/60 border border-[#c4aaff]/25 rounded-xl p-5 space-y-2.5">
              {lab.prerequisites.map((p, i) => (
                <p key={i} className="flex items-start gap-2.5 text-[#1e1e6e]/65 text-sm">
                  <svg className="w-4 h-4 text-[#5c5ce0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {p}
                </p>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Steps */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Step-by-Step Instructions</SectionLabel>
          <div className="space-y-5">
            {lab.steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.05)}
                className="flex gap-5 bg-white/50 border border-[#c4aaff]/20 rounded-xl p-5 hover:border-[#5c5ce0]/30 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold mt-0.5"
                  style={{ background: lab.pillarColor }}
                >
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-[#1e1e6e] font-semibold text-sm mb-1">{step.title}</h4>
                  <p className="text-[#1e1e6e]/60 text-sm leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Note or Warning */}
        {lab.note && (
          <motion.div
            {...fadeUp(0)}
            className="flex gap-4 bg-[#5c5ce0]/8 border border-[#5c5ce0]/20 rounded-xl p-5"
          >
            <svg className="w-5 h-5 text-[#5c5ce0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#1e1e6e]/70 text-sm leading-relaxed">{lab.note}</p>
          </motion.div>
        )}

        {lab.warning && (
          <motion.div
            {...fadeUp(0)}
            className="flex gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5"
          >
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-800 text-sm leading-relaxed">{lab.warning}</p>
          </motion.div>
        )}

        {/* Screenshot instructions */}
        {lab.screenshot && (
          <motion.section {...fadeUp(0)}>
            <SectionLabel>Completion Screenshot</SectionLabel>
            <div className="bg-[#1e1e6e]/5 border-2 border-dashed border-[#5c5ce0]/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#5c5ce0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-[#1e1e6e] font-semibold text-sm mb-1">{lab.screenshot.label}</p>
                  <p className="text-[#1e1e6e]/60 text-sm leading-relaxed">{lab.screenshot.body}</p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Cleanup */}
        {lab.cleanup && (
          <motion.section {...fadeUp(0)}>
            <SectionLabel>Cleanup</SectionLabel>
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-2.5">
              {lab.cleanup.map((step, i) => (
                <p key={i} className="flex items-start gap-2.5 text-red-700 text-sm">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {step}
                </p>
              ))}
            </div>
          </motion.section>
        )}

        {/* Key Takeaways */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Key Takeaways</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lab.takeaways.map((t, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/60 border border-[#c4aaff]/20 rounded-xl p-4">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                  style={{ background: lab.pillarColor }}
                />
                <p className="text-[#1e1e6e]/70 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Nav footer */}
        <motion.div {...fadeUp(0)} className="pt-8 border-t border-[#c4aaff]/30">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5c5ce0] text-sm font-medium hover:text-[#1e1e6e] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Labs
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[#5c5ce0] text-xs uppercase tracking-[0.25em] font-semibold mb-5">{children}</p>
  )
}
