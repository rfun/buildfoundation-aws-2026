import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import assignments from '../data/assignments.js'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
})

export default function AssignmentPage() {
  const { weekNum } = useParams()
  const assignment = assignments[parseInt(weekNum, 10)]

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#f0eeff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1e1e6e]/40 text-sm mb-4">Assignment not found</p>
          <Link to="/" className="text-[#5c5ce0] text-sm hover:text-[#1e1e6e] transition-colors">← Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0eeff]">
      {/* Hero */}
      <div className="bg-[#6666dd] pt-28 pb-16 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1e1e6e]/20 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-medium transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">
              Week {assignment.week} Assignment
            </span>
          </div>

          <motion.h1
            {...fadeUp(0)}
            className="text-white font-bold mb-3 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {assignment.title}
          </motion.h1>

          <motion.p {...fadeUp(1)} className="text-white/60 text-base mb-6">
            {assignment.subtitle}
          </motion.p>

          <motion.div {...fadeUp(2)} className="flex flex-wrap gap-2 mb-6">
            {assignment.tags.map((tag) => (
              <span
                key={tag}
                className="text-white text-xs font-medium bg-white/15 border border-white/20 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p {...fadeUp(3)} className="text-white/40 text-xs flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated time: {assignment.time}
          </motion.p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Overview */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Overview</SectionLabel>
          <p className="text-[#1e1e6e]/70 leading-relaxed text-base">{assignment.overview}</p>
        </motion.section>

        {/* Objectives */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Objectives</SectionLabel>
          <ul className="space-y-3">
            {assignment.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-[#6666dd] text-white text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="text-[#1e1e6e]/70 text-sm leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Deliverables */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>What to Submit</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assignment.deliverables.map((d, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.07)}
                className="bg-white/60 border border-[#c4aaff]/20 rounded-xl p-5 hover:border-[#5c5ce0]/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#6666dd] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-[#1e1e6e] font-semibold text-sm mb-1">{d.title}</h4>
                    <p className="text-[#1e1e6e]/55 text-xs leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Resume Bullet */}
        {assignment.resumeBullet && (
          <motion.section {...fadeUp(0)}>
            <SectionLabel>On Your Resume</SectionLabel>
            <div className="bg-[#f0eeff] border border-[#c4aaff]/30 rounded-xl p-5">
              <p className="text-[#1e1e6e]/70 text-sm leading-relaxed mb-2">
                Once you finish this assignment, you can describe it on a resume or LinkedIn like:
              </p>
              <p className="text-[#5c5ce0] font-semibold text-sm italic">"{assignment.resumeBullet}"</p>
            </div>
          </motion.section>
        )}

        {/* Parts / Sections */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Instructions</SectionLabel>
          <div className="space-y-10">
            {assignment.sections.map((section, si) => (
              <div key={si}>
                <h3
                  className="text-[#1e1e6e] font-bold text-lg mb-5"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      {...fadeUp(i * 0.05)}
                      className="flex gap-4 bg-white/50 border border-[#c4aaff]/20 rounded-xl p-4 hover:border-[#5c5ce0]/25 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center bg-[#1e1e6e]/8 text-[#5c5ce0] text-xs font-bold mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-[#1e1e6e]/65 text-sm leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tips */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Tips & Gotchas</SectionLabel>
          <div className="bg-[#5c5ce0]/8 border border-[#5c5ce0]/20 rounded-xl p-6 space-y-3">
            {assignment.tips.map((tip, i) => (
              <p key={i} className="flex items-start gap-3 text-[#1e1e6e]/70 text-sm leading-relaxed">
                <svg className="w-4 h-4 text-[#5c5ce0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {tip}
              </p>
            ))}
          </div>
        </motion.section>

        {/* Cleanup */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Cleanup</SectionLabel>
          <div className="flex gap-4 bg-red-50 border border-red-100 rounded-xl p-5">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-red-700 text-sm leading-relaxed">{assignment.cleanup}</p>
          </div>
        </motion.section>

        {/* Nav footer */}
        <motion.div {...fadeUp(0)} className="pt-8 border-t border-[#c4aaff]/30 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5c5ce0] text-sm font-medium hover:text-[#1e1e6e] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          {assignments[assignment.week + 1] && (
            <Link
              to={`/assignment/${assignment.week + 1}`}
              className="inline-flex items-center gap-2 text-[#5c5ce0] text-sm font-medium hover:text-[#1e1e6e] transition-colors"
            >
              Week {assignment.week + 1} Assignment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
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
