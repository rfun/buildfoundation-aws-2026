import { useState } from 'react'

// ─── Shared sub-components ────────────────────────────────────────────────────

function Footer({ dark = true }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-10 py-3 text-xs font-medium pointer-events-none ${
        dark ? 'text-white/20' : 'text-[#1e1e6e]/20'
      }`}
    >
      <span>The Build Fellowship</span>
      <span>© 2026</span>
    </div>
  )
}

function Bullet({ children, color = '#5c5ce0', size = 'lg' }) {
  const sizeClass = size === 'xs' ? 'text-sm' : size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <li className={`flex items-start gap-3 text-[#1e1e6e]/70 ${sizeClass} leading-snug`}>
      <span className="flex-shrink-0 mt-0.5" style={{ color }}>▸</span>
      <span>{children}</span>
    </li>
  )
}

function SectionEyebrow({ children, light = false, large = false }) {
  return (
    <p
      className={`font-semibold uppercase tracking-[0.25em] ${large ? 'text-base mb-2' : 'text-xs mb-1.5'} ${
        light ? 'text-white/40' : 'text-[#5c5ce0]/70'
      }`}
    >
      {children}
    </p>
  )
}

function ReadingLinks({ links, compact = false }) {
  if (!links?.length) return null
  return (
    <div className={compact ? 'mt-4 space-y-2' : 'mt-5 space-y-3'}>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-4 rounded-lg border-l-4 border-[#7c4dff] bg-[#f5f3ff] hover:bg-[#ece7ff] transition-colors no-underline ${
            compact ? 'px-4 py-2.5' : 'px-6 py-4'
          }`}
        >
          <span className={compact ? 'text-lg flex-shrink-0' : 'text-2xl flex-shrink-0'}>{link.icon ?? '🔗'}</span>
          <span className={`text-[#5a4fcf] font-medium leading-snug ${compact ? 'text-sm' : 'text-lg'}`}>
            {link.label} ↗
          </span>
        </a>
      ))}
    </div>
  )
}

// ─── Slide layout components ──────────────────────────────────────────────────

function SlideTitle({ content }) {
  return (
    <div
      className="w-full h-full relative flex flex-col items-start justify-center px-16 select-none"
      style={{ background: 'linear-gradient(135deg, #1e1e6e 0%, #3b35cc 55%, #7c5ce0 100%)' }}
    >
      <div className="text-white/50 text-lg font-light tracking-[0.4em] uppercase mb-4">{content.label}</div>
      <div
        className="text-white font-bold leading-none"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(72px, 11vw, 140px)' }}
      >
        {content.title.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="text-white/30 text-base tracking-[0.35em] uppercase mt-8">{content.subtitle}</div>
    </div>
  )
}

function SlideSectionLight({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col items-start justify-center px-16 bg-[#f0eeff] select-none">
      {content.brandHeader && (
        <div className="text-[#5c5ce0] text-base font-semibold uppercase tracking-[0.3em] mb-5">
          {content.brandHeader}
        </div>
      )}
      <div
        className="text-[#1e1e6e] font-bold leading-tight"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 8.5vw, 110px)' }}
      >
        {content.title}
      </div>
      {(content.date || content.week) && (
        <div className="text-[#1e1e6e]/40 text-xl mt-7 tracking-wide">
          {content.week ? `${content.week}  ·  ` : ''}
          {content.date}
        </div>
      )}
      <Footer dark={false} />
    </div>
  )
}

function SlideSectionDark({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col items-start justify-center px-16 bg-[#1e1e6e] select-none">
      <div
        className="text-white font-bold leading-tight"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 8.5vw, 110px)' }}
      >
        {content.title.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      {content.tocItems && (
        <div className="mt-9 space-y-3.5">
          {content.tocItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 text-white/60 text-xl">
              <span className="text-[#c4aaff] font-mono text-base w-20 flex-shrink-0">{item.slideRef}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
      {content.readingLinks && (
        <div className="mt-9 space-y-2.5">
          {content.readingLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c4aaff]/80 text-xl hover:text-[#c4aaff] block"
            >
              → {link.label}
            </a>
          ))}
        </div>
      )}
      {content.readingLabel && (
        <div className="mt-6 text-[#c4aaff]/70 text-xl">{content.readingLabel}</div>
      )}
      <Footer dark />
    </div>
  )
}

function SlideAgenda({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-20 bg-white select-none">
      <div
        className="text-[#1e1e6e] font-bold mb-10"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 5.5vw, 64px)' }}
      >
        {content.title}
      </div>
      <ol className="space-y-5">
        {content.items.map((item, i) => (
          <li key={i} className="flex items-center gap-5 text-[#1e1e6e]/75 text-2xl">
            <span className="w-10 h-10 rounded-full bg-[#5c5ce0] text-white text-base font-bold flex items-center justify-center flex-shrink-0">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
      <Footer dark={false} />
    </div>
  )
}

function SlideToc({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-20 bg-[#f0eeff] select-none">
      <div
        className="text-[#1e1e6e] font-bold mb-12"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(40px, 6vw, 68px)' }}
      >
        {content.title}
      </div>
      <div className="space-y-6">
        {content.items.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-[#5c5ce0] font-bold text-3xl w-12 flex-shrink-0">{item.number}</span>
            <div className="h-px flex-1 bg-[#5c5ce0]/20" />
            <span className="text-[#1e1e6e] font-medium text-2xl">{item.label}</span>
          </div>
        ))}
      </div>
      <Footer dark={false} />
    </div>
  )
}

function SlideTwoColumn({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-20 bg-white select-none">
      <div
        className="text-[#1e1e6e] font-bold mb-10"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(34px, 4.5vw, 50px)' }}
      >
        {content.columnTitle}
      </div>
      <div className="space-y-7">
        {content.items.map((item, i) => (
          <div key={i} className="flex gap-7 items-start">
            <div className="text-[#5c5ce0] font-bold text-xl w-40 flex-shrink-0 pt-0.5">{item.label}</div>
            <div className="text-[#1e1e6e]/65 text-xl leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
      <Footer dark={false} />
    </div>
  )
}

function SlideCallout({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center px-16 bg-[#f0eeff] select-none">
      <div className="bg-white rounded-2xl shadow-xl shadow-[#5c5ce0]/10 p-16 text-center max-w-4xl w-full border border-[#c4aaff]/20">
        <div
          className="text-[#1e1e6e] font-bold mb-7"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4.5vw, 46px)' }}
        >
          {content.calloutTitle}
        </div>
        <div className="text-[#5c5ce0] text-2xl leading-relaxed">{content.calloutText}</div>
      </div>
      <Footer dark={false} />
    </div>
  )
}

function SlideTable({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-16 bg-[#1e1e6e] text-white select-none">
      <div
        className="font-bold mb-8"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4.5vw, 46px)' }}
      >
        {content.tableTitle}
      </div>
      <div className="space-y-0">
        {content.rows.map((row, i) => (
          <div key={i} className="flex items-center gap-6 py-4 border-b border-white/10 text-xl">
            <span className="text-[#c4aaff] flex-shrink-0 font-bold">✓</span>
            <span className="font-semibold w-64 flex-shrink-0 text-white/90">{row.label}</span>
            <span className="text-white/60 text-lg">{row.value}</span>
          </div>
        ))}
      </div>
      <Footer dark />
    </div>
  )
}

function SlideBenefits({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-16 bg-[#1e1e6e] text-white select-none">
      <div className="space-y-10">
        {content.benefits.map((benefit, i) => (
          <div key={i} className="flex items-start gap-7">
            <div className="text-5xl flex-shrink-0">{benefit.icon}</div>
            <div>
              <div className="font-semibold text-2xl text-white/90 mb-1.5">{benefit.title}</div>
              <div className="text-white/55 text-lg leading-relaxed">{benefit.text}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer dark />
    </div>
  )
}

function SlideCards({ content }) {
  return (
    <div className="w-full h-full relative flex flex-col justify-center px-16 py-10 bg-white select-none">
      <div
        className="text-[#1e1e6e] font-bold mb-8"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px, 4vw, 44px)' }}
      >
        {content.cardsTitle}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {content.cards.map((card, i) => (
          <div key={i} className="bg-[#f0eeff] rounded-xl p-6 border border-[#c4aaff]/20">
            <div className="text-4xl mb-3">{card.icon}</div>
            <div className="text-[#1e1e6e] font-semibold text-xl mb-1.5">{card.title}</div>
            <div className="text-[#1e1e6e]/60 text-base leading-relaxed">{card.text}</div>
          </div>
        ))}
      </div>
      <Footer dark={false} />
    </div>
  )
}

// Most flexible layout — handles many content shapes
function SlideContent({ content }) {
  // Dense slides (many sections/items) need a smaller scale to stay on one screen —
  // everything else gets full presentation-size text.
  const itemCount =
    (content.items?.length ?? 0) +
    (content.sections?.length ?? 0) +
    (content.breachCards?.length ?? 0) +
    (content.securityItems?.length ?? 0) +
    (content.definitionGrid?.length ?? 0)
  const dense = itemCount >= 5

  return (
    <div className="w-full h-full relative flex flex-col px-16 pt-24 pb-16 bg-white overflow-y-auto select-none">
      {/* Header */}
      {content.subtitle && <SectionEyebrow large>{content.subtitle}</SectionEyebrow>}
      {content.sectionSubtitle && <SectionEyebrow large>{content.sectionSubtitle}</SectionEyebrow>}
      {content.title && (
        <div
          className="text-[#1e1e6e] font-bold mb-5 leading-snug"
          style={{ fontFamily: 'Playfair Display, serif', fontSize: dense ? 'clamp(26px, 3.4vw, 38px)' : 'clamp(32px, 4.2vw, 48px)' }}
        >
          {content.title}
        </div>
      )}

      {/* Description */}
      {content.description && (
        <p className="text-[#1e1e6e]/65 text-xl leading-relaxed mb-5 max-w-3xl">{content.description}</p>
      )}
      {content.highlight && (
        <div className="text-[#5c5ce0] text-lg font-semibold mb-5 bg-[#f0eeff] px-4 py-2 rounded-lg w-fit">
          {content.highlight}
        </div>
      )}

      {/* Definition callout box */}
      {content.definitionBox && (
        <div className="bg-[#1e1e6e] text-white rounded-xl p-8 mb-5">
          <p className="text-white/85 text-2xl leading-relaxed italic">"{content.definitionBox}"</p>
        </div>
      )}

      {/* Callout + data transfer table */}
      {content.callout && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 text-amber-800 text-lg font-semibold mb-4">
          ⚠ {content.callout}
        </div>
      )}
      {content.tableTitle && content.rows && (
        <div className="bg-[#f0eeff] rounded-lg p-5 mb-4">
          <div className="text-[#1e1e6e] font-semibold text-lg mb-3">{content.tableTitle}</div>
          <div className="space-y-2">
            {content.rows.map((row, i) => (
              <div key={i} className="flex justify-between text-base">
                <span className="text-[#1e1e6e]/65">{row.tier}</span>
                <span className="text-[#5c5ce0] font-mono">{row.price}</span>
              </div>
            ))}
          </div>
          {content.tableNote && (
            <p className="text-[#1e1e6e]/40 text-sm mt-3 italic">{content.tableNote}</p>
          )}
        </div>
      )}

      {/* Simple bullet list */}
      {content.items && (
        <ul className="space-y-2.5 mb-4">
          {content.items.map((item, i) => (
            <Bullet key={i} size={dense ? 'sm' : 'lg'}>{item}</Bullet>
          ))}
        </ul>
      )}

      {/* Definition grid (VPC slide) */}
      {content.definitionGrid && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {content.definitionGrid.map((def, i) => (
            <div key={i} className="bg-[#f0eeff] rounded-lg p-5">
              <div className="text-[#5c5ce0] text-base font-semibold mb-1.5">{def.term}</div>
              <div className="text-[#1e1e6e]/65 text-base leading-relaxed">{def.definition}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sections (two-column or stacked groups) */}
      {content.sections && (
        <div className={`gap-6 mb-4 ${content.sections.length === 2 ? 'grid grid-cols-2' : 'space-y-5'}`}>
          {content.sections.map((section, si) => (
            <div key={si}>
              {section.heading && (
                <div className="text-[#5c5ce0] text-base font-semibold uppercase tracking-wide mb-2">
                  {section.heading}
                </div>
              )}
              {section.items && (
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <Bullet key={i} size={dense ? 'sm' : 'lg'}>{item}</Bullet>
                  ))}
                </ul>
              )}
              {section.text && (
                <p className="text-[#1e1e6e]/65 text-lg leading-relaxed">{section.text}</p>
              )}
              {section.readingLinks && <ReadingLinks links={section.readingLinks} compact={dense} />}
            </div>
          ))}
        </div>
      )}

      {/* Breach cards (red warning cards) */}
      {content.breachCards && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {content.breachCards.map((card, i) => (
            <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-5">
              <div className="text-red-700 text-base font-bold mb-1.5">{card.heading}</div>
              <div className="text-red-600/80 text-base leading-relaxed">{card.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* Security items — 2-column grid, last item spans full width if count is odd */}
      {content.securityItems && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {content.securityItems.map((item, i) => {
            const isLastOdd = content.securityItems.length % 2 === 1 && i === content.securityItems.length - 1
            return (
              <div key={i} className={`bg-[#f0eeff] rounded-lg p-3.5 ${isLastOdd ? 'col-span-2' : ''}`}>
                <div className="text-[#5c5ce0] text-sm font-semibold mb-1.5">{item.heading}</div>
                {item.items && (
                  <ul className="space-y-0.5">
                    {item.items.map((li, j) => (
                      <Bullet key={j} size="xs">{li}</Bullet>
                    ))}
                  </ul>
                )}
                {item.text && <p className="text-[#1e1e6e]/65 text-sm">{item.text}</p>}
              </div>
            )
          })}
        </div>
      )}

      {/* EC2 pricing tiers */}
      {content.pricingTiers && (
        <div className="grid grid-cols-3 gap-5 mb-4">
          {content.pricingTiers.map((tier, i) => (
            <div key={i} className="bg-[#1e1e6e] rounded-xl p-6 text-white">
              <div
                className="font-bold text-xl mb-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {tier.name}
              </div>
              {tier.details.map((d, j) => (
                <div key={j} className="text-white/60 text-base mt-1.5 leading-snug">{d}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Lambda pricing calculation */}
      {content.calcSections && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {content.calcSections.map((section, i) => (
            <div key={i} className="bg-[#f0eeff] rounded-lg p-5">
              <div className="text-[#5c5ce0] text-base font-semibold mb-1.5">{section.heading}</div>
              {section.lines.map((line, j) => (
                <div key={j} className="text-[#1e1e6e]/65 text-base font-mono leading-relaxed">{line}</div>
              ))}
            </div>
          ))}
          {content.result && (
            <div className="col-span-2 bg-[#5c5ce0] text-white rounded-lg p-4 text-lg font-semibold text-center">
              {content.result}
            </div>
          )}
        </div>
      )}

      {/* Reading links */}
      {content.readingLinks && <ReadingLinks links={content.readingLinks} compact={dense} />}

      <Footer dark={false} />
    </div>
  )
}

function SlideImageBg({ content, weekNum, slideIndex }) {
  const [imgError, setImgError] = useState(false)
  const imgNum = content?.img ?? slideIndex + 1
  const publicPath = `${import.meta.env.BASE_URL}slides/week${weekNum}/Slide${imgNum}.jpeg`

  if (!imgError) {
    return (
      <img
        src={publicPath}
        alt={content?.ariaLabel || `Slide ${slideIndex + 1}`}
        className="w-full h-full object-contain bg-[#1e1e6e]"
        onError={() => setImgError(true)}
        draggable={false}
      />
    )
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none px-16 text-center"
      style={{ background: 'linear-gradient(135deg, #1e1e6e 0%, #2d2d8a 55%, #3b35cc 100%)' }}
    >
      <p className="text-white/15 text-[10px] uppercase tracking-[0.3em] mb-4">
        Week {weekNum} · Slide {slideIndex + 1}
      </p>
      {content?.ariaLabel && (
        <p className="text-white/35 text-sm leading-relaxed max-w-xl">{content.ariaLabel}</p>
      )}
    </div>
  )
}

// ─── Main router ──────────────────────────────────────────────────────────────

const LAYOUT_MAP = {
  'slide-title': SlideTitle,
  'slide-section-light': SlideSectionLight,
  'slide-section-dark': SlideSectionDark,
  'slide-agenda': SlideAgenda,
  'slide-toc': SlideToc,
  'slide-content': SlideContent,
  'slide-two-column': SlideTwoColumn,
  'slide-callout': SlideCallout,
  'slide-table': SlideTable,
  'slide-benefits': SlideBenefits,
  'slide-cards': SlideCards,
  'slide-image-bg': SlideImageBg,
}

export default function SlideRenderer({ slide, weekNum, slideIndex }) {
  const Component = LAYOUT_MAP[slide?.type] || SlideImageBg
  return <Component content={slide?.content ?? {}} weekNum={weekNum} slideIndex={slideIndex} />
}
