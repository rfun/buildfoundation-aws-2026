/**
 * Client-side QR code, rendered as inline SVG.
 *
 * No network, no image service — the whole point of the quiz is that it works
 * from a statically hosted bundle, and a QR that round-trips to a third-party
 * chart API would break in exactly the room with the bad wifi.
 *
 * `qrcode-generator` is a zero-dependency encoder (Reed-Solomon, masking and
 * format bits are fiddly enough that hand-rolling them for a code that gets
 * projected to a lecture hall is not a good trade).
 *
 * Rendered dark-on-white with a 4-module quiet zone, regardless of the
 * surrounding dark UI: scanners want a light background and a white card also
 * survives being photographed off a projector screen.
 */

import { useMemo } from 'react'
import qrcode from 'qrcode-generator'

/** Modules of white margin around the code. 4 is the spec minimum. */
const QUIET_ZONE = 4

/**
 * @param {string} value  URL to encode
 * @param {number} size   rendered edge length in px
 */
export default function QrCode({ value, size = 200, className = '' }) {
  const { path, extent } = useMemo(() => {
    // typeNumber 0 = pick the smallest version that fits. 'M' error correction
    // (~15% recoverable) is the usual choice for a screen-displayed code.
    const qr = qrcode(0, 'M')
    qr.addData(value)
    qr.make()

    const count = qr.getModuleCount()
    // One `M x y h1 v1 h-1 z` per dark module. Adjacent modules merge visually
    // because they share an edge, so no seams appear between them.
    let d = ''
    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (!qr.isDark(row, col)) continue
        d += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`
      }
    }
    return { path: d, extent: count + QUIET_ZONE * 2 }
  }, [value])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${extent} ${extent}`}
      // Modules are whole user units, so snapping to the pixel grid keeps edges
      // hard instead of antialiasing them into grey mush at projector scale.
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code linking to ${value}`}
      className={`rounded-lg ${className}`}
    >
      <rect width={extent} height={extent} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  )
}
