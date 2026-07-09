import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const tags = ['Computer Science', 'DevOps', 'Amazon Web Services', 'Infrastructure As Code', 'Cloud Engineering']

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1e1e6e 0%, #3b35cc 35%, #7c5ce0 65%, #c4aaff 100%)' }}
      />
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#c4aaff]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#5c5ce0]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Tags */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[#c4aaff]/80 text-xs font-medium border border-[#c4aaff]/25 bg-[#c4aaff]/8 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Project title */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-white mb-5 leading-[1.05]"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '-0.02em',
          }}
        >
          Learn and implement a
          <br />
          <span style={{ color: '#c4aaff' }}>well-architected cloud</span>
          <br />
          infrastructure on AWS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-white/65 text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Understand and implement fundamental principles associated with software development
          in the Amazon Web Services cloud using Infrastructure as Code (IaC) and Terraform.
        </motion.p>

        {/* Meta row */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/50 text-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Thursdays · 6:00 PM ET
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            8 weeks · 2–3 hrs/week
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Intermediate
          </span>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#workshops"
            className="px-8 py-3.5 bg-white text-[#1e1e6e] font-semibold rounded-full text-sm hover:bg-[#f0eeff] transition-colors duration-200 shadow-xl"
          >
            View Workshops
          </a>
          <a
            href="#learn"
            className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-full text-sm hover:bg-white/10 transition-colors duration-200"
          >
            What You'll Learn
          </a>
        </motion.div>

        {/* Branding attribution */}
        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-12 text-white/25 text-xs"
        >
          A <span className="text-white/40 font-medium">Build Fellowship</span> project by{' '}
          <span className="text-white/40 font-medium">OpenAvenues Foundation</span>
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
