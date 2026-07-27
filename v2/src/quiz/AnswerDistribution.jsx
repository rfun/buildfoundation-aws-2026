/**
 * Live answer-distribution chart for the presenter console (spec §7.2).
 *
 * ---------------------------------------------------------------------------
 * Design decisions, per the `dataviz` skill. Recorded here so a later change
 * doesn't quietly undo one of them.
 * ---------------------------------------------------------------------------
 *
 * FORM. Magnitude across a handful of nominal categories (the options of one
 * question) → horizontal bars, one per option. Horizontal rather than columns
 * because the category labels are full sentences of AWS exam prose, which do not
 * fit under a column. No axis and no gridlines: with four bars, a direct value
 * label at each bar's tip carries every number, and the skill's order is direct
 * labels before gridlines.
 *
 * COLOR. Before Reveal this is ONE series — every bar takes the same hue. Bars
 * are deliberately not coloured by size (a value-ramp on nominal categories
 * double-encodes length as hue) and not coloured per option (option identity is
 * already carried by the letter badge and the label). After Reveal the fills
 * switch to the reserved STATUS colours, because at that moment the colour means
 * good/bad rather than identity.
 *
 * Validated with the skill's script against this page's actual surface, the
 * quiz shell navy `#14145a`, not the skill's default surfaces:
 *
 *   validate_palette.js "#9085e9" --mode dark --surface "#14145a"
 *     → PASS on all checks (lightness band, chroma floor, ≥3:1 contrast)
 *   validate_palette.js "#0ca30c,#d03b3b" --mode dark --surface "#14145a" --pairs all
 *     → contrast, band, chroma and normal-vision all PASS;
 *       CVD separation FAILS — deutan ΔE 4.1, the classic red/green collision.
 *
 * That CVD failure is real and is NOT waved away. Spec §7.2 asks for the
 * Mentimeter look (correct green, incorrect red), and the skill's rule for
 * status colour is that it always ships with an icon AND a label rather than
 * carrying meaning alone. So every revealed row gets a ✓/✗ glyph and the word
 * "Correct"/"Incorrect" in text ink. A red/green-blind viewer reads the result
 * off the glyph and the word; the colour is reinforcement, never the channel.
 *
 * MARKS. 22px bars (skill cap is 24px), 4px rounded data-end and square at the
 * baseline, rows separated by far more than the 2px surface gap, no stroke drawn
 * around any fill. Text never wears the data colour — labels and values use text
 * ink, except a value that has to sit inside a filled bar, which is the
 * documented exception and picks white for contrast against the fill.
 *
 * NO HOVER LAYER. The skill ships tooltips by default; this chart is a
 * deliberate exception. It lives on a projector, driven from a laptop nobody is
 * mousing over, and every value is already direct-labelled — so a tooltip would
 * gate nothing and would be invisible to the room. The row list itself is the
 * table view: label + value in plain text for every option.
 *
 * PROJECTION. Type scales with the viewport (`clamp`) so the same component is
 * readable on a laptop and from the back of a lecture hall.
 */

import { optionLetter } from './mockSession'

/** Chart palette. See the header for how each of these was validated. */
const SURFACE = '#14145a'
const SERIES = '#9085e9' // single-series hue, pre-reveal
const GOOD = '#0ca30c' // status: correct option
const CRITICAL = '#d03b3b' // status: incorrect option
const TRACK = 'rgba(255,255,255,0.07)'
const INK = '#ffffff'
const INK_SECONDARY = 'rgba(255,255,255,0.78)'
const INK_MUTED = 'rgba(255,255,255,0.45)'

const BAR_HEIGHT = 22

/**
 * Past this fill fraction the tip label would overflow the track, so it moves
 * inside the bar end instead of sitting past it. The skill is explicit that a
 * label is never clipped and never hidden with `overflow: hidden`.
 */
const LABEL_INSIDE_THRESHOLD = 0.82

/**
 * @param {string[]} options       option labels for the current question
 * @param {number[]} counts        selections per option index
 * @param {number} respondents     people who answered this question (the caption's denominator)
 * @param {number[]|null} revealed correct indices, or null while the question is still open
 */
export default function AnswerDistribution({ options, counts, respondents, revealed }) {
  // Bars are scaled to the largest single count, so the leading option always
  // fills the track and small differences stay visible from the back of a room.
  // A multi-select question can have counts summing past the respondent count,
  // which is another reason not to scale to the respondent total.
  const max = Math.max(1, ...counts)

  return (
    <div className="flex flex-col gap-4" style={{ color: INK }}>
      {options.map((label, i) => {
        const count = counts[i] ?? 0
        const fraction = count / max
        const isCorrect = revealed ? revealed.includes(i) : null
        const fill = revealed ? (isCorrect ? GOOD : CRITICAL) : SERIES
        const labelInside = fraction >= LABEL_INSIDE_THRESHOLD && count > 0

        return (
          <div key={i}>
            <div className="flex items-start gap-x-4 gap-y-1 mb-2">
              <span
                className="shrink-0 grid place-items-center rounded-lg font-bold"
                style={{
                  width: 34,
                  height: 34,
                  background: 'rgba(255,255,255,0.10)',
                  fontSize: 'clamp(15px, 1.5vw, 19px)',
                }}
              >
                {optionLetter(i)}
              </span>
              <span
                className="flex-1 leading-snug pt-1"
                style={{ color: INK_SECONDARY, fontSize: 'clamp(15px, 1.7vw, 22px)' }}
              >
                {label}
              </span>
              {/* Icon + word, so correctness never rests on the fill colour.
                  An option nobody picked and that isn't the answer says nothing
                  — a column of ✗ next to empty bars is noise. The span keeps its
                  width either way so the labels stay in one column. */}
              {revealed ? (
                <span
                  className="shrink-0 flex items-center justify-end gap-1.5 font-semibold pt-1 whitespace-nowrap"
                  style={{ color: INK, fontSize: 'clamp(13px, 1.3vw, 17px)', width: '7.5em' }}
                >
                  {isCorrect || count > 0 ? (
                    <>
                      <span aria-hidden="true">{isCorrect ? '✓' : '✗'}</span>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </>
                  ) : null}
                </span>
              ) : null}
            </div>

            <div
              className="relative"
              // Indented to clear the letter badge (34px) + the row gap (16px),
              // so every bar starts on one baseline under the labels.
              style={{ height: BAR_HEIGHT, background: TRACK, borderRadius: 4, marginLeft: 50 }}
            >
              <div
                className="h-full transition-[width] duration-300 ease-out"
                style={{
                  width: `${fraction * 100}%`,
                  background: fill,
                  // Square where it meets the baseline, rounded at the data end.
                  borderRadius: '0 4px 4px 0',
                }}
              />
              <span
                className="absolute top-0 h-full flex items-center font-bold tabular-nums"
                style={{
                  fontSize: 'clamp(15px, 1.6vw, 21px)',
                  // Inside the fill it needs contrast against the fill, not the
                  // surface — the one place a label is allowed on a colour.
                  color: labelInside ? '#ffffff' : count > 0 ? INK : INK_MUTED,
                  ...(labelInside
                    ? { right: 10 }
                    : { left: `calc(${fraction * 100}% + 10px)` }),
                  // The 2px surface-coloured halo keeps the number readable
                  // where it sits over the fill edge.
                  textShadow: labelInside ? 'none' : `0 0 6px ${SURFACE}`,
                }}
              >
                {count}
              </span>
            </div>
          </div>
        )
      })}

      <p style={{ color: INK_MUTED, fontSize: 'clamp(12px, 1.1vw, 15px)' }}>
        {respondents === 1 ? '1 response' : `${respondents} responses`}
        {revealed ? ' · revealed' : ''}
      </p>
    </div>
  )
}
