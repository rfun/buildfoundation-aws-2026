import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] },
})

const steps = [
  {
    title: 'Install AWS CLI',
    desc: 'The AWS Command Line Interface lets you interact with AWS services from your terminal.',
    url: 'https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html',
  },
  {
    title: 'Install Terraform',
    desc: 'Install HashiCorp Terraform for infrastructure-as-code deployment.',
    url: 'https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli',
  },
  {
    title: 'Get a free AWS Account',
    desc: 'Sign up for the AWS Free Tier to get hands-on with real cloud resources.',
    url: 'https://aws.amazon.com/free',
  },
]

export default function SetupPage() {
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
              Getting Started
            </span>
          </div>

          <motion.h1
            {...fadeUp(0)}
            className="text-white font-bold mb-3 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            Local Environment Setup
          </motion.h1>

          <motion.p {...fadeUp(1)} className="text-white/60 text-base">
            Setup instructions for Terraform and the AWS CLI
          </motion.p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <motion.section {...fadeUp(0)}>
          <SectionLabel>Before Week 4</SectionLabel>
          <p className="text-[#1e1e6e]/70 leading-relaxed text-base">
            Complete the three steps below to get your local environment ready. You'll need Terraform and the
            AWS CLI installed, plus a free AWS account, before the Infrastructure as Code week.
          </p>
        </motion.section>

        <motion.section {...fadeUp(0)}>
          <SectionLabel>Setup Steps</SectionLabel>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.a
                key={i}
                href={step.url}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp(i * 0.07)}
                className="flex gap-4 bg-white/60 border border-[#c4aaff]/20 rounded-xl p-5 hover:border-[#5c5ce0]/30 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-[#6666dd] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#1e1e6e] font-semibold text-sm mb-1 group-hover:text-[#5c5ce0] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[#1e1e6e]/55 text-xs leading-relaxed mb-2">{step.desc}</p>
                  <span className="text-[#4db6ac] text-xs font-medium break-all group-hover:underline">
                    {step.url}
                  </span>
                </div>
              </motion.a>
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
            Back to Home
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
