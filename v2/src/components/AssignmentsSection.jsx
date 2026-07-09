import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { enabledAssignmentWeeks } from '../courseConfig'

const allAssignments = [
  {
    week: 4,
    title: 'Terraform Infrastructure',
    desc: 'Deploy a full cloud environment: VPC, EC2 instance with EBS volume, and an S3 bucket — all defined as code.',
    tags: ['Terraform', 'VPC', 'EC2', 'S3'],
    time: '~2 hours',
  },
  {
    week: 5,
    title: 'Security & Resilience Hardening',
    desc: 'Harden your Week 4 Terraform infrastructure with Security Groups, Auto Scaling Groups, and AWS Backup policies.',
    tags: ['Security Groups', 'Auto Scaling', 'AWS Backup'],
    time: '~2 hours',
  },
]

const assignments = allAssignments.filter((a) => enabledAssignmentWeeks.has(a.week))

function AssignmentCard({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href={`/assignment/${item.week}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative bg-[#1e1e6e] rounded-2xl p-8 border border-[#5c5ce0]/20 hover:border-[#c4aaff]/40 hover:shadow-2xl hover:shadow-[#1e1e6e]/30 transition-all duration-300 block no-underline"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="text-[#c4aaff]/40 text-xs font-semibold uppercase tracking-widest">
          Week {item.week} Assignment
        </span>
        <span className="text-[#c4aaff]/50 text-xs">{item.time}</span>
      </div>

      <h3
        className="text-white font-bold text-2xl mb-3 group-hover:text-[#c4aaff] transition-colors duration-200"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {item.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed mb-6">{item.desc}</p>

      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-[#c4aaff] text-xs font-medium bg-[#c4aaff]/10 border border-[#c4aaff]/20 px-2.5 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#c4aaff] group-hover:border-[#c4aaff] transition-all duration-200">
        <svg className="w-4 h-4 text-white/30 group-hover:text-[#1e1e6e] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.a>
  )
}

export default function AssignmentsSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-[#6666dd] relative overflow-hidden">
      {/* Noise-like pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-medium mb-4">Build Projects</p>
          <h2
            className="text-white font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            Assignments
          </h2>
          <p className="text-white/60 text-base mt-4 max-w-lg">
            Put theory into practice with infrastructure you actually deploy on AWS.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {assignments.map((a, i) => (
            <AssignmentCard key={a.week} item={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
