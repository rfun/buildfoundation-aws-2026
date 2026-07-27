import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import demos from '../data/demos.js'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
})

export default function DemoPage() {
  const { demoId } = useParams()
  const demo = demos[demoId]

  if (!demo) {
    return (
      <div className="min-h-screen bg-[#f0eeff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1e1e6e]/40 text-sm mb-4">Demo not found</p>
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
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: demo.accent + '15' }}
        />

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
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
              style={{ background: demo.accent }}
            >
              Live Demo
            </span>
            <span className="text-white/30 text-xs">Week {demo.week}</span>
          </div>

          <motion.h1
            {...fadeUp(0)}
            className="text-white font-bold mb-4 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {demo.title}
          </motion.h1>
          <motion.p {...fadeUp(0.5)} className="text-white/50 text-base mb-6">{demo.subtitle}</motion.p>

          <motion.div {...fadeUp(1)} className="flex flex-wrap gap-5 text-white/50 text-sm">
            <Meta icon="clock">{demo.time}</Meta>
            <Meta icon="check">Free Tier</Meta>
            <Meta icon="code">{demo.repoPath}</Meta>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        <motion.section {...fadeUp(0)}>
          <SectionLabel>Overview</SectionLabel>
          <p className="text-[#1e1e6e]/70 leading-relaxed text-base">{demo.overview}</p>
        </motion.section>

        {demo.careerConnection && (
          <motion.section {...fadeUp(0)}>
            <div
              className="rounded-xl p-5 border-l-4"
              style={{ background: `${demo.accent}10`, borderColor: demo.accent }}
            >
              <p className="text-[#1e1e6e]/70 text-sm leading-relaxed">
                <span className="font-semibold" style={{ color: demo.accent }}>Career connection: </span>
                {demo.careerConnection}
              </p>
            </div>
          </motion.section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section {...fadeUp(0)}>
            <SectionLabel>What it covers</SectionLabel>
            <ul className="space-y-3">
              {demo.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: demo.accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[#1e1e6e]/70 text-sm leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section {...fadeUp(1)}>
            <SectionLabel>Before you start</SectionLabel>
            <div className="bg-white/60 border border-[#c4aaff]/25 rounded-xl p-5 space-y-2.5">
              {demo.prerequisites.map((p, i) => (
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

        {/* Cost */}
        {demo.cost && (
          <motion.section {...fadeUp(0)}>
            <SectionLabel>{demo.cost.label}</SectionLabel>
            <div className="bg-white/60 border border-[#c4aaff]/25 rounded-xl overflow-hidden">
              {demo.cost.rows.map(([resource, why], i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-1 sm:gap-4 px-5 py-3.5 border-b border-[#c4aaff]/15 last:border-0"
                >
                  <code className="text-[#5c5ce0] text-xs font-mono break-words">{resource}</code>
                  <span className="text-[#1e1e6e]/60 text-sm">{why}</span>
                </div>
              ))}
            </div>
            {demo.cost.note && (
              <p className="text-[#1e1e6e]/45 text-sm mt-3 italic">{demo.cost.note}</p>
            )}
          </motion.section>
        )}

        {/* Acts */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Demo script</SectionLabel>
          <div className="space-y-6">
            {demo.acts.map((act) => (
              <motion.div
                key={act.num}
                {...fadeUp(0)}
                className="bg-white/50 border border-[#c4aaff]/20 rounded-xl p-6"
              >
                <div className="flex items-baseline gap-3 mb-4">
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: demo.accent }}
                  >
                    {act.num}
                  </div>
                  <h4 className="text-[#1e1e6e] font-semibold text-base">{act.title}</h4>
                  <span className="text-[#1e1e6e]/35 text-xs ml-auto">{act.time}</span>
                </div>
                <div className="space-y-3.5">
                  {act.blocks.map((block, i) => (
                    <Block key={i} block={block} accent={demo.accent} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Cheat sheet */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Command cheat sheet</SectionLabel>
          <div className="bg-[#1e1e6e] rounded-xl overflow-hidden">
            {demo.cheatsheet.map(([cmd, desc], i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-1 sm:gap-4 px-5 py-3 border-b border-white/5 last:border-0"
              >
                <code className="text-[#c4aaff] text-xs font-mono">{cmd}</code>
                <span className="text-white/50 text-sm">{desc}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Troubleshooting */}
        <motion.section {...fadeUp(0)}>
          <SectionLabel>If something breaks live</SectionLabel>
          <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
            {demo.troubleshooting.map(([symptom, fix], i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-1 sm:gap-4 px-5 py-3.5 border-b border-amber-200/50 last:border-0"
              >
                <span className="text-amber-900 text-sm font-medium">{symptom}</span>
                <span className="text-amber-800/70 text-sm">{fix}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div {...fadeUp(0)} className="pt-8 border-t border-[#c4aaff]/30">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#5c5ce0] text-sm font-medium hover:text-[#1e1e6e] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Block({ block, accent }) {
  switch (block.type) {
    case 'code':
      return (
        <pre className="bg-[#12123f] rounded-lg p-4 overflow-x-auto">
          <code className="text-[#c4aaff] text-xs font-mono leading-relaxed whitespace-pre">{block.code}</code>
        </pre>
      )
    case 'say':
      return (
        <div
          className="rounded-lg px-4 py-3 border-l-4"
          style={{ background: `${accent}0d`, borderColor: accent }}
        >
          <p className="text-[#1e1e6e]/75 text-sm leading-relaxed">
            <span className="font-semibold uppercase tracking-wide text-xs" style={{ color: accent }}>Say: </span>
            “{block.text}”
          </p>
        </div>
      )
    case 'list':
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[#1e1e6e]/65 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5c5ce0] flex-shrink-0 mt-1.5" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    className="text-[#5c5ce0] text-xs uppercase tracking-wide font-semibold pb-2 pr-4 border-b border-[#c4aaff]/30"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-2.5 pr-4 text-sm align-top border-b border-[#c4aaff]/15 ${
                        j === 0 ? 'text-[#1e1e6e] font-medium whitespace-nowrap' : 'text-[#1e1e6e]/60'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'text':
    default:
      return <p className="text-[#1e1e6e]/65 text-sm leading-relaxed">{block.text}</p>
  }
}

function Meta({ icon, children }) {
  const paths = {
    clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    code: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  }
  return (
    <span className="flex items-center gap-1.5">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={paths[icon]} />
      </svg>
      {children}
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[#5c5ce0] text-xs uppercase tracking-[0.25em] font-semibold mb-5">{children}</p>
  )
}
