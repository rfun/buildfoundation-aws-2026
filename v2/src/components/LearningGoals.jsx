import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const goals = [
  {
    num: '01',
    title: 'Hosting Approaches',
    desc: 'Identify different approaches to hosting web applications including on-premise, Hybrid, and cloud.',
  },
  {
    num: '02',
    title: 'Infrastructure as Code',
    desc: 'Deploy cloud infrastructure resources and maintain them using the principles of Infrastructure as Code and Terraform.',
  },
  {
    num: '03',
    title: 'Containers & Serverless',
    desc: 'Explore hosting containerized applications (AWS ECS and EKS) and using serverless technologies (AWS Lambda).',
  },
  {
    num: '04',
    title: 'Resilient Architecture',
    desc: 'Develop a multi-zone available, highly reliable and resilient cloud architecture to host a simple web application.',
  },
]

function GoalCard({ goal, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      {/* Number accent */}
      <span
        className="block text-[80px] font-black leading-none text-[#1e1e6e]/6 mb-2 select-none"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {goal.num}
      </span>
      <div className="w-8 h-0.5 bg-[#5c5ce0] mb-4" />
      <h3 className="text-[#1e1e6e] font-bold text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
        {goal.title}
      </h3>
      <p className="text-[#1e1e6e]/60 text-sm leading-relaxed">{goal.desc}</p>
    </motion.div>
  )
}

export default function LearningGoals() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section id="learn" className="py-32 bg-[#f0eeff] relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#c4aaff]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[#5c5ce0]/70 text-xs uppercase tracking-[0.3em] font-medium mb-4">
            Learning Goals
          </p>
          <h2
            className="text-[#1e1e6e] font-bold leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)' }}
          >
            By the end, you will
            <br />
            <span className="text-[#5c5ce0]">be able to…</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {goals.map((goal, i) => (
            <GoalCard key={goal.num} goal={goal} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
