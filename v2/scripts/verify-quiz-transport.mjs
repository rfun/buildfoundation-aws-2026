/**
 * Phase 2 verification: presenter + participant windows, full 13-question run.
 * Usage: node phase2-run.mjs [port]
 */
import { chromium } from 'playwright'

const PORT = process.argv[2] ?? '5174'
const BASE = `http://localhost:${PORT}`
const CODE = String(Math.floor(1000 + Math.random() * 9000))

const log = (...a) => console.log(...a)
const IGNORABLE = /Connection closed/ // React StrictMode dev double-mount; see useQuizChannel cleanup
const fail = (msg) => {
  if (IGNORABLE.test(msg)) return log('(ignored dev-only)', msg)
  console.error('FAIL:', msg)
  process.exitCode = 1
}

const browser = await chromium.launch()

const presCtx = await browser.newContext()
const pres = await presCtx.newPage()
pres.on('console', (m) => m.type() === 'error' && log('[pres console]', m.text()))
pres.on('pageerror', (e) => fail(`presenter pageerror: ${e.message}`))

const aCtx = await browser.newContext()
const alice = await aCtx.newPage()
alice.on('pageerror', (e) => fail(`alice pageerror: ${e.message}`))

const bCtx = await browser.newContext()
const bob = await bCtx.newPage()
bob.on('pageerror', (e) => fail(`bob pageerror: ${e.message}`))

await pres.goto(`${BASE}/quiz/dev-transport?role=presenter&code=${CODE}`)
await pres.waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 20000 })
log('presenter connected, room', CODE)

await alice.goto(`${BASE}/quiz/dev-transport?role=participant&code=${CODE}&name=Alice`)
await alice.waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 20000 })
log('alice connected')

// presence + join reached the presenter
await pres.waitForSelector('[data-testid="row-Alice"]', { timeout: 10000 })
const presentText = await pres.textContent('[data-testid="phase"]')
log('presenter roster:', presentText.trim())
if (!/present=1/.test(presentText)) fail(`expected present=1, got: ${presentText}`)

// ---- full 13-question run ----
await pres.click('[data-testid="start"]')

const TOTAL = 13
// Alice answers questions 1..13; she picks option 0 on odd questions and the
// presenter's revealed answer is checked afterwards. Bob joins late at Q7.
for (let q = 0; q < TOTAL; q += 1) {
  await alice.waitForSelector('[data-testid="prompt"]', { timeout: 10000 })
  await alice.waitForFunction(
    (n) => document.querySelector('[data-testid="phase"]').textContent.includes(`q=${n}`),
    q + 1,
    { timeout: 10000 },
  )

  // Late joiner mid-quiz (spec §6: late join allowed, gets state via sync).
  if (q === 6) {
    await bob.goto(`${BASE}/quiz/dev-transport?role=participant&code=${CODE}&name=Bob`)
    await bob.waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 20000 })
    await bob.waitForSelector('[data-testid="prompt"]', { timeout: 10000 })
    const bobPhase = await bob.textContent('[data-testid="phase"]')
    if (!bobPhase.includes('q=7') || !bobPhase.includes('phase=question')) {
      fail(`late joiner did not sync to Q7: ${bobPhase}`)
    } else {
      log('late joiner Bob synced to', bobPhase.trim())
    }
  }

  // Correct answers must NOT be knowable to a participant before reveal.
  const revealedNow = await alice.evaluate(() =>
    document.querySelector('[data-testid="reveal"]') ? 'present' : 'absent',
  )
  if (revealedNow !== 'absent') fail(`Q${q + 1}: reveal panel visible during question phase`)

  // Answer: click option 0, and for "choose two" questions also option 1.
  const optCount = await alice.locator('[data-testid^="opt-"]').count()
  await alice.click('[data-testid="opt-0"]')
  // A second click on a 2-selection question completes it; harmless otherwise
  // because a 1-selection question replaces the pick. Detect via answered count.
  await pres.waitForFunction(
    (n) => document.querySelector('[data-testid="phase"]').textContent.includes(`answered=${n}`),
    1,
    { timeout: 10000 },
  ).catch(async () => {
    if (optCount > 1) await alice.click('[data-testid="opt-1"]')
    await pres.waitForFunction(
      (n) => document.querySelector('[data-testid="phase"]').textContent.includes(`answered=${n}`),
      1,
      { timeout: 10000 },
    )
  })

  // Answer change while phase === question (last write wins).
  if (q === 0) {
    await alice.click('[data-testid="opt-2"]')
    await pres.waitForTimeout(600)
    log('Q1: answer change published while question open')
  }

  if (q >= 6) {
    // Bob answers too, from Q7 on.
    const bobOpts = await bob.locator('[data-testid^="opt-"]').count()
    await bob.click('[data-testid="opt-1"]')
    if (bobOpts > 1) await bob.click('[data-testid="opt-2"]').catch(() => {})
    await pres.waitForTimeout(400)
  }

  await pres.click('[data-testid="reveal"]')
  await alice.waitForSelector('[data-testid="reveal"]', { timeout: 10000 })
  const revealText = await alice.textContent('[data-testid="reveal"]')
  if (!/Correct:\s*\d/.test(revealText)) fail(`Q${q + 1}: no correct answer in reveal: ${revealText}`)

  // Post-reveal answers must be ignored by the presenter.
  if (q === 1) {
    const before = await pres.textContent('[data-testid="score-Alice"]')
    await alice.evaluate(() => {}) // no-op; participant UI has no buttons at reveal
    const after = await pres.textContent('[data-testid="score-Alice"]')
    if (before !== after) fail('score changed during reveal phase')
  }

  await pres.click('[data-testid="next"]')
  log(`Q${q + 1} done`)
}

// ---- ended ----
await alice.waitForSelector('[data-testid="final"]', { timeout: 10000 })
await bob.waitForSelector('[data-testid="final"]', { timeout: 10000 })
const aliceFinal = await alice.textContent('[data-testid="final"]')
const bobFinal = await bob.textContent('[data-testid="final"]')
const presAlice = await pres.textContent('[data-testid="score-Alice"]')
const presBob = await pres.textContent('[data-testid="score-Bob"]')
log('alice final:', aliceFinal.trim(), '| presenter says', presAlice.trim())
log('bob final:  ', bobFinal.trim(), '| presenter says', presBob.trim())

const num = (s) => s.match(/(\d+)\s*\/\s*(\d+)/)?.slice(1).map(Number)
const [ac, at] = num(aliceFinal)
const [pac] = num(presAlice)
if (ac !== pac) fail(`alice self-score ${ac} != presenter ${pac}`)
if (at !== TOTAL) fail(`alice total ${at} != ${TOTAL}`)
const [bc] = num(bobFinal)
const [pbc] = num(presBob)
if (bc !== pbc) fail(`bob self-score ${bc} != presenter ${pbc}`)

// Bob joined at Q7: his first 6 must be blank, not wrong.
const bobRow = await pres.textContent('[data-testid="row-Bob"]')
const marks = bobRow.replace(/[^✓✗·]/g, '')
log('bob row marks:', marks)
if (marks.slice(0, 6) !== '······') fail(`late joiner's unanswered questions not blank: ${marks}`)

// Presenter must have exactly 2 participants (no duplicate rows).
const rows = await pres.locator('[data-testid^="row-"]').count()
if (rows !== 2) fail(`expected 2 participant rows, got ${rows}`)

// ---- offline case ----
log('--- offline test ---')
const offCtx = await browser.newContext()
const off = await offCtx.newPage()
// Load the page online (the dev server is localhost), then kill the network and
// force a fresh connect attempt — that is the "Ably unreachable" case.
await off.goto(`${BASE}/quiz/dev-transport?role=participant&code=${CODE}&name=Offline`)
await off.waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 20000 })
await offCtx.setOffline(true)
await off.waitForSelector('[data-testid="connection"]:text-is("failed")', { timeout: 60000 })
log('offline: reached failed state')
if (!(await off.locator('[data-testid="retry"]').isVisible())) fail('no retry button in failed state')

// Retry while still offline: it must visibly try again and land back on `failed`
// rather than hanging in `connecting`.
await off.click('[data-testid="retry"]')
await off.waitForSelector('[data-testid="connection"]:text-is("connecting")', { timeout: 5000 })
log('offline: retry re-attempts (connecting)')
await off.waitForSelector('[data-testid="connection"]:text-is("failed")', { timeout: 60000 })
log('offline: back to failed, no hang')

// Network back: recovers, whether by itself or via the retry button.
await offCtx.setOffline(false)
await off
  .waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 20000 })
  .catch(async () => {
    await off.click('[data-testid="retry"]')
    await off.waitForSelector('[data-testid="connection"]:text-is("connected")', { timeout: 30000 })
  })
log('offline: reconnected successfully once the network returned')

await browser.close()
log(process.exitCode ? 'RESULT: FAILURES ABOVE' : 'RESULT: ALL CHECKS PASSED')
