import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

function StepCard({ step, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="flex items-start gap-5 bg-white/70 rounded-xl p-5 border border-[#c4aaff]/20"
    >
      <span
        className="text-[#5c5ce0]/30 font-black text-2xl leading-none flex-shrink-0 mt-0.5"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {step.num}
      </span>
      <div>
        <h4 className="text-[#1e1e6e] font-semibold text-sm mb-1">{step.title}</h4>
        <p className="text-[#1e1e6e]/50 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  )
}

const steps = [
  { num: '01', title: 'Install AWS CLI', desc: 'Set up the AWS Command Line Interface to interact with AWS services from your terminal.' },
  { num: '02', title: 'Install Terraform', desc: 'Install HashiCorp Terraform for infrastructure-as-code deployment.' },
  { num: '03', title: 'Configure Credentials', desc: 'Connect your AWS account credentials to both the CLI and Terraform.' },
  { num: '04', title: 'Verify Setup', desc: 'Run a quick validation to confirm everything is wired up correctly.' },
]

export default function SetupSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="setup" className="py-32 bg-[#f0eeff]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, x: -30 }}
            animate={titleInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#5c5ce0]/70 text-xs uppercase tracking-[0.3em] font-medium mb-4">
              Getting Started
            </p>
            <h2
              className="text-[#1e1e6e] font-bold leading-tight mb-6"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Local Environment
              <br />
              <span className="text-[#5c5ce0]">Setup Guide</span>
            </h2>
            <p className="text-[#1e1e6e]/60 leading-relaxed mb-8">
              Before Week 4, you'll need Terraform and the AWS CLI installed locally. This guide walks you through every step on macOS, Windows, and Linux.
            </p>
            <Link
              to="/setup"
              className="inline-flex items-center gap-2 bg-[#1e1e6e] text-white font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[#5c5ce0] transition-colors duration-200"
            >
              Open Setup Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Right: Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
