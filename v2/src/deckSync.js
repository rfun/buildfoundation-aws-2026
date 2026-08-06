// Keeps the deck window (/week/:n) and the presenter-notes window
// (/week/:n/notes) on the same slide.
//
// BroadcastChannel is same-origin and in-browser — no server, no Ably, nothing
// to configure. Both windows are the same origin because the notes window is
// opened from the deck (or pasted from the same site), so this Just Works
// offline and on GitHub Pages alike.
//
// A channel is per-week, so two decks open at once never talk to each other.
//
// Messages:
//   { type: 'slide', index, total }  deck → notes   position changed
//   { type: 'request' }              notes → deck   "where are you?" (on open)
//   { type: 'goto', index }          notes → deck   drive the deck from notes
//
// Note that BroadcastChannel never echoes a message back to the context that
// posted it, so neither side hears itself and there is no feedback loop.

export function createDeckChannel(week) {
  if (typeof BroadcastChannel === 'undefined') return null
  return new BroadcastChannel(`deck-week-${week}`)
}
