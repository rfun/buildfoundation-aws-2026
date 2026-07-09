import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function FellowSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-32 bg-[#6666dd] relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-medium">Your Instructor</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-[#1e1e6e]/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 items-start"
        >
          {/* Avatar placeholder */}
          <div className="flex-shrink-0">
            <img
              src="https://avgkrhojcamcagufngrr.supabase.co/storage/v1/object/public/fellow-headshots/325f0dc9-a53f-423d-a0ee-e383b30bea89.webp"
              alt="Rohit Khattar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-[#c4aaff]/30"
            />
            <div className="mt-4 space-y-1">
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>Rohit Khattar</p>
              <p className="text-[#c4aaff]/70 text-xs font-medium uppercase tracking-wider">Software Development Fellow</p>
              <p className="text-white/40 text-xs">Open Avenues Foundation</p>
              <a
                href="https://www.linkedin.com/in/rohit-khattar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-[#c4aaff] text-xs font-medium hover:text-white transition-colors duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <p className="text-white/80 leading-relaxed mb-4">
              Rohit Khattar is a Software Engineering Build Fellow at OpenAvenues Foundation, where he works
              with students leading projects in Software Engineering and DevOps.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Rohit is a Senior Software Engineer at CHG Healthcare, where he focuses on designing, developing,
              and maintaining software systems that connect healthcare clients and providers, protect sensitive
              information, fulfill regulatory requirements, and ensure financial accounting systems are secure.
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              With over 8 years of experience across roles including junior software developer, backend engineer,
              technical team lead, and DevOps engineer — Rohit holds a Masters in Information Technology and a
              PhD in Civil Engineering.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {['Senior Software Engineer', 'DevOps', 'Cloud Architecture', 'Terraform', '8+ Years Experience'].map((tag) => (
                <span
                  key={tag}
                  className="text-[#c4aaff] text-xs font-medium bg-[#c4aaff]/10 border border-[#c4aaff]/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-white/25 text-xs mt-6 italic">
              Fun fact: can finish a 400-page book in one sitting, and loves Sushi. 🍣
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
