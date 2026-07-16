import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1e1e6e]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#c4aaff] rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
            <div className="bg-[#1e1e6e] rounded-sm" />
            <div className="bg-[#1e1e6e]/40 rounded-sm" />
            <div className="bg-[#1e1e6e]/40 rounded-sm" />
            <div className="bg-[#1e1e6e] rounded-sm" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-white/60 uppercase tracking-widest font-medium">The</span>
            <span className="text-white font-bold text-sm tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Build Fellowship
            </span>
          </div>
        </Link>

        {/* Nav links — client-side links to home sections so they work from any route */}
        <div className="hidden md:flex items-center gap-8">
          {[['Workshops', 'workshops'], ['Learn', 'learn'], ['Labs', 'labs'], ['Setup', 'setup']].map(([label, id]) => (
            <Link
              key={label}
              to={`/#${id}`}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right badge */}
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs font-medium hidden sm:block">OpenAvenues</span>
          <span className="bg-[#c4aaff]/20 border border-[#c4aaff]/30 text-[#c4aaff] text-xs font-semibold px-3 py-1 rounded-full">
            AWS 2026
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
