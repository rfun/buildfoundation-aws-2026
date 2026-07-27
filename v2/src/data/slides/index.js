// Per-week slide data, one module per week in this directory.
// Each week module default-exports { title, slides: [...] }.
// Each slide: { type, content, note }
// type → SlideRenderer picks the right layout component
// note → shown only when ?admin=true (presenter notes panel)
// slide-image-bg slides try /public/slides/weekN/SlideN.jpeg, where N = content.img
// (falls back to array position + 1 if content.img is omitted); ariaLabel is the fallback text

import week1 from './week1.js'
import week2 from './week2.js'
import week3 from './week3.js'
import week4 from './week4.js'
import week5 from './week5.js'
import week6 from './week6.js'
import week7 from './week7.js'
import week8 from './week8.js'

const slides = {
  1: week1,
  2: week2,
  3: week3,
  4: week4,
  5: week5,
  6: week6,
  7: week7,
  8: week8,
}

export default slides
