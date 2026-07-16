import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { enabledWeekIds } from '../courseConfig'

const MotionLink = motion.create(Link)

const allWeeks = [
  {
    num: 1,
    title: 'Introduction',
    desc: 'Project layout, team introductions, what cloud computing is, what sets AWS apart, and a live local environment setup demo.',
    topics: ['Project Layout', 'Cloud Computing', 'AWS Overview', 'Local Setup'],
  },
  {
    num: 2,
    title: 'AWS Well-Architected Framework',
    desc: 'The six pillars — Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability — and the AWS Well-Architected Tool.',
    topics: ['6 Pillars', 'Design Principles', 'WAF Tool', 'Labs'],
  },
  {
    num: 3,
    title: 'Base Cloud Concepts',
    desc: 'VPC and cloud networking, AWS databases (RDS, DynamoDB, Aurora), compute options (EC2, Lambda, ECS, EKS), and storage (S3, EBS, EFS).',
    topics: ['VPC & Networking', 'Databases', 'Compute', 'S3 / EBS / EFS'],
  },
  {
    num: 4,
    title: 'Infrastructure as Code',
    desc: 'Why traditional infrastructure methods break down at scale, and how Terraform solves it — write, plan, apply, destroy. Includes a live demo and the Week 4 assignment.',
    topics: ['IaC Concepts', 'Terraform', 'HCL', 'Live Demo'],
  },
  {
    num: 5,
    title: 'Cloud Security, HA & Reliability',
    desc: 'Real-world breach case studies, common AWS misconfigurations, Amazon Inspector, Auto Scaling Groups, Availability Zones, and AWS Backup.',
    topics: ['Security', 'High Availability', 'Auto Scaling', 'AWS Backup'],
  },
  {
    num: 6,
    title: 'Cloud Migration Project',
    desc: 'Introduction to the final project scenario: develop a migration strategy for moving a web architecture from On-Prem to AWS using the 6 Rs framework.',
    topics: ['The 6 Rs', 'Migration Strategy', 'Architecture Diagrams', 'Cost Estimation'],
  },
  {
    num: 7,
    title: 'Design Review',
    desc: 'Each group presents their architecture diagram and migration plan for peer and instructor review. Time to iterate before final presentations.',
    topics: ['Architecture Review', 'Peer Feedback', 'WAF Alignment', 'Iteration'],
  },
  {
    num: 8,
    title: 'Final Presentation',
    desc: 'Present your complete cloud migration strategy and implemented infrastructure. 15 minutes per group including Q&A.',
    topics: ['Final Project', 'Live Demo', 'Q&A', 'Wrap-Up'],
  },
]

const weeks = allWeeks.filter((w) => enabledWeekIds.has(w.num))

function WeekCard({ week, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <MotionLink
      ref={ref}
      to={`/week/${week.num}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-[#f0eeff] rounded-2xl p-7 border border-[#c4aaff]/30 hover:border-[#5c5ce0]/50 hover:shadow-2xl hover:shadow-[#5c5ce0]/10 transition-all duration-300 cursor-pointer block no-underline"
    >
      {/* Week number */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="text-[72px] font-black leading-none text-[#1e1e6e]/5 select-none"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {week.num}
        </span>
        <span className="text-[#5c5ce0] text-xs font-semibold uppercase tracking-widest bg-[#5c5ce0]/10 px-3 py-1.5 rounded-full">
          Week {week.num}
        </span>
      </div>

      <h3
        className="text-[#1e1e6e] font-bold text-lg mb-2.5 group-hover:text-[#5c5ce0] transition-colors duration-200"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {week.title}
      </h3>
      <p className="text-[#1e1e6e]/55 text-sm leading-relaxed mb-5">{week.desc}</p>

      <div className="flex flex-wrap gap-1.5">
        {week.topics.map((t) => (
          <span key={t} className="text-[#5c5ce0] text-xs font-medium bg-[#5c5ce0]/8 px-2.5 py-1 rounded-md">
            {t}
          </span>
        ))}
      </div>

      <div className="absolute bottom-7 right-7 w-7 h-7 rounded-full bg-[#1e1e6e]/5 flex items-center justify-center group-hover:bg-[#5c5ce0] transition-colors duration-200">
        <svg className="w-3.5 h-3.5 text-[#1e1e6e]/30 group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </MotionLink>
  )
}

export default function WeeksSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="workshops" className="py-32 bg-[#1e1e6e] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#5c5ce0]/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#c4aaff]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[#c4aaff]/60 text-xs uppercase tracking-[0.3em] font-medium mb-4">Course Curriculum</p>
          <h2
            className="text-white font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            8 Workshops to
            <br />
            <span className="text-[#c4aaff]">Cloud Mastery</span>
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-lg">
            Thursdays, 6:00 PM ET · 2–3 hours per week · July – August 2026
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {weeks.map((week, i) => (
            <WeekCard key={week.num} week={week} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
