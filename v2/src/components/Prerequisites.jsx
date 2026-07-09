import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const prereqs = [
  {
    icon: '🌐',
    title: 'Internet Access',
    desc: 'Access to the internet for AWS Console, documentation, and course materials.',
  },
  {
    icon: '☁️',
    title: 'AWS Free-Tier Account',
    desc: 'An AWS Free-Tier account to complete hands-on labs and deploy infrastructure.',
  },
  {
    icon: '💻',
    title: 'Basic Terminal Skills',
    desc: 'Ability to run basic commands in Terminal / Bash / Shell. Any basic IT course is enough.',
  },
  {
    icon: '🏗️',
    title: 'Web App Fundamentals',
    desc: 'Understanding of what a web application is and its various components (frontend, backend, database).',
  },
]

function PrereqCard({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="bg-white/5 border border-white/[0.08] rounded-2xl p-6"
    >
      <span className="text-3xl mb-4 block">{item.icon}</span>
      <h4 className="text-white font-semibold text-sm mb-2">{item.title}</h4>
      <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
    </motion.div>
  )
}

export default function Prerequisites() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section className="py-24 bg-[#1e1e6e] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#5c5ce0]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-[#c4aaff]/60 text-xs uppercase tracking-[0.3em] font-medium mb-4">Before You Start</p>
          <h2
            className="text-white font-bold"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)' }}
          >
            Prerequisites
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {prereqs.map((p, i) => (
            <PrereqCard key={p.title} item={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
