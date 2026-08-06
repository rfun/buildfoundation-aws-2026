/**
 * Verifies deck <-> presenter-notes sync over BroadcastChannel.
 *
 * Both pages live in one browser context so they share an origin, which is what
 * BroadcastChannel requires. Run the dev server first, then:
 *   node scripts/verify-presenter-notes.mjs [port]
 */
import { chromium } from 'playwright'

const PORT = process.argv[2] ?? '5173'
const BASE = `http://localhost:${PORT}`
const WEEK = 5

const fails = []
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
  if (!ok) fails.push(name)
}

const browser = await chromium.launch()
const ctx = await browser.newContext()

const deck = await ctx.newPage()
deck.on('console', (m) => m.type() === 'error' && console.log('  [deck error]', m.text()))
await deck.goto(`${BASE}/week/${WEEK}?admin=true`)

const deckCounter = deck.locator('span.tabular-nums').first()
await deckCounter.waitFor({ timeout: 15000 })
check('deck loads', (await deckCounter.textContent()).includes('1 /'), await deckCounter.textContent())

const notes = await ctx.newPage()
notes.on('console', (m) => m.type() === 'error' && console.log('  [notes error]', m.text()))
await notes.goto(`${BASE}/week/${WEEK}/notes`)

const status = notes.locator('span', { hasText: /^Slide \d+ of \d+$/ }).first()

// --- handshake: notes asks the deck where it is on open ---
await status.waitFor({ timeout: 10000 })
check('notes connects on open', (await status.textContent()) === `Slide 1 of 36`, await status.textContent())

// --- deck drives notes ---
await deck.keyboard.press('ArrowRight')
await deck.keyboard.press('ArrowRight')
await notes.waitForTimeout(400)
check('deck -> notes', (await status.textContent()) === 'Slide 3 of 36', await status.textContent())

// the active row should be highlighted, and it should be row 3
const activeNum = notes.locator('li.bg-\\[\\#2d2d7a\\]\\/60 span').first()
check('active row highlighted', (await activeNum.textContent()).trim() === '3', await activeNum.textContent())

// --- notes drives deck ---
await notes.getByRole('button', { name: 'Next →' }).click()
await deck.waitForTimeout(400)
check('notes -> deck', (await deckCounter.textContent()).trim() === '4 / 36', await deckCounter.textContent())

await notes.getByRole('button', { name: '← Back' }).click()
await deck.waitForTimeout(400)
check('notes back -> deck', (await deckCounter.textContent()).trim() === '3 / 36', await deckCounter.textContent())

// --- arrow keys inside the notes window drive the deck too ---
await notes.keyboard.press('ArrowRight')
await deck.waitForTimeout(400)
check('notes arrow key -> deck', (await deckCounter.textContent()).trim() === '4 / 36', await deckCounter.textContent())

// --- late join: a notes window opened mid-presentation catches up ---
await deck.keyboard.press('ArrowRight')
await deck.keyboard.press('ArrowRight')
await deck.waitForTimeout(300)
const lateNotes = await ctx.newPage()
await lateNotes.goto(`${BASE}/week/${WEEK}/notes`)
const lateStatus = lateNotes.locator('span', { hasText: /^Slide \d+ of \d+$/ }).first()
await lateStatus.waitFor({ timeout: 10000 })
check('late-opened notes catches up', (await lateStatus.textContent()) === 'Slide 6 of 36', await lateStatus.textContent())

// --- a week-4 notes window must NOT follow the week-5 deck ---
const otherWeek = await ctx.newPage()
await otherWeek.goto(`${BASE}/week/4/notes`)
await otherWeek.waitForTimeout(600)
const waiting = await otherWeek.getByText('Waiting for the deck window').count()
check('channels are per-week', waiting === 1, `waiting banners: ${waiting}`)

await browser.close()
console.log(fails.length ? `\n${fails.length} FAILED` : '\nAll checks passed')
process.exit(fails.length ? 1 : 0)
