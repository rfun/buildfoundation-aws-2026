export default function Footer() {
  return (
    <footer className="bg-[#14145a] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Logos */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#c4aaff] rounded grid grid-cols-2 grid-rows-2 gap-0.5 p-1">
              <div className="bg-[#1e1e6e] rounded-sm" />
              <div className="bg-[#1e1e6e]/40 rounded-sm" />
              <div className="bg-[#1e1e6e]/40 rounded-sm" />
              <div className="bg-[#1e1e6e] rounded-sm" />
            </div>
            <span
              className="text-white font-bold text-sm italic"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              The Build Fellowship
            </span>
          </div>
          <span className="text-white/30 text-sm font-medium">OpenAvenues</span>
        </div>

        {/* Right: Copyright */}
        <div className="text-right">
          <p className="text-white/30 text-xs">© The Build Fellowship 2026</p>
          <p className="text-white/20 text-xs mt-0.5">buildfellowship.com</p>
        </div>
      </div>
    </footer>
  )
}
