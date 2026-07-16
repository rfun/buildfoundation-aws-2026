import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { enabledPillarIds } from '../courseConfig'

const allPillars = [
  { id: 'opex', name: 'Operational Excellence', color: '#4db6ac', labs: ['Exploring CloudTrail Event History', 'Building a CloudWatch Dashboard'] },
  { id: 'security', name: 'Security', color: '#e53935', labs: ['IAM Users, Groups & Least Privilege', 'Securing an S3 Bucket'] },
  { id: 'reliability', name: 'Reliability', color: '#1e88e5', labs: ['S3 Versioning & Object Recovery', 'VPC Infrastructure & Availability Zones'] },
  { id: 'performance', name: 'Performance Efficiency', color: '#f5a623', labs: ['EC2 Instance Types & Launching', 'Creating & Querying DynamoDB'] },
  { id: 'cost', name: 'Cost Optimization', color: '#43a047', labs: ['AWS Budgets & Free Tier Tracking', 'Pricing Calculator & Trusted Advisor'] },
  { id: 'sustainability', name: 'Sustainability', color: '#8e24aa', labs: ['S3 Lifecycle Policies', 'Well-Architected Framework Review'] },
]

const pillars = allPillars.filter((p) => enabledPillarIds.has(p.id))

function PillarCard({ pillar, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#c4aaff]/20 hover:border-[#5c5ce0]/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Pillar header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: pillar.color }} />
        <span className="text-[#1e1e6e] font-semibold text-sm">{pillar.name}</span>
      </div>

      {/* Labs */}
      <div className="space-y-2">
        {pillar.labs.map((lab, i) => (
          <Link
            key={lab}
            to={`/labs/${pillar.id}-${i + 1}`}
            className="flex items-center gap-3 group"
          >
            <span
              className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
              style={{ background: pillar.color }}
            >
              {i + 1}
            </span>
            <span className="text-[#1e1e6e]/70 text-sm group-hover:text-[#5c5ce0] transition-colors duration-150 leading-snug">
              {lab}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

export default function LabsSection() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="labs" className="py-32 bg-[#f0eeff] relative overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-[#c4aaff]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-64 rounded-full bg-[#5c5ce0]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[#5c5ce0]/70 text-xs uppercase tracking-[0.3em] font-medium mb-4">
            Week 2 · Hands-On Labs
          </p>
          <h2
            className="text-[#1e1e6e] font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            Well-Architected
            <br />
            <span className="text-[#5c5ce0]">Framework Labs</span>
          </h2>
          <p className="text-[#1e1e6e]/50 text-base mt-4 max-w-xl">
            12 hands-on labs across all six WAF pillars. Free-tier compatible, AWS Console only, under 30 minutes each.
          </p>
        </motion.div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.id} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
