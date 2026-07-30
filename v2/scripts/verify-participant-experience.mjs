/**
 * Phase 4 verification (plan: "join at Q1, at Q7, and reconnect mid-question").
 *
 * One real presenter console and two real participant tabs against the real Ably
 * channel. Each participant gets its own browser context so they get their own
 * `sessionStorage` — same as two phones — and Ana is reloaded mid-question to
 * prove the stored `clientId` rejoins her instead of opening a second row.
 *
 *   node scripts/verify-participant-experience.mjs [port]
 */
import { chromium } from 'playwright'

const PORT = process.argv[2] ?? '5199'
const BASE = `http://localhost:${PORT}`
const log = (...a) => console.log('•', ...a)
const fails = []
function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
  if (!ok) fails.push(name)
}

/** Week 4 answer key, by qIndex. Kept here so the script asserts real outcomes. */
const KEY = [[3], [1], [3], [1], [3], [1], [1], [2], [0], [0, 4], [1, 2], [1, 2], [0, 2]]

const browser = await chromium.launch()

/* ------------------------------- presenter ------------------------------- */

const presenterCtx = await browser.newContext()
const presenter = await presenterCtx.newPage()
presenter.on('console', (m) => m.type() === 'error' && console.log('  [presenter]', m.text()))
await presenter.goto(`${BASE}/quiz/present/week4`)

const codeEl = presenter.locator('p.tabular-nums').first()
await codeEl.waitFor({ timeout: 15000 })
const code = (await codeEl.innerText()).trim()
log('room code', code)

await presenter.waitForFunction(
  () =>
    [...document.querySelectorAll('button')].some(
      (b) => b.textContent.includes('Start quiz') && !b.disabled,
    ),
  { timeout: 20000 },
)

/**
 * Wait until a participant page is showing question `n` and accepting input.
 * The Submit button only exists in the question view, so it — not the options,
 * which the reveal view also renders — is the signal that the phase has actually
 * flipped. Waiting on the options alone races the reveal→question transition.
 */
function waitForQuestion(page, n) {
  return page.waitForFunction(
    (num) =>
      Boolean(document.querySelector('[data-testid="submit"]')) &&
      new RegExp(`Question ${num} of`, 'i').test(document.body.innerText),
    n,
    { timeout: 25000 },
  )
}

/** Mobile-first means the page body never scrolls sideways (spec §7.1). */
const noSideScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)

const reveal = () => presenter.getByRole('button', { name: 'Reveal' }).click()
const next = () => presenter.getByRole('button', { name: /Next|Finish/ }).click()
async function advanceTo(target) {
  // Reveal + Next until the presenter is showing question `target` (1-based).
  for (;;) {
    const at = Number((await presenter.innerText('body')).match(/Question (\d+) of/i)?.[1] ?? 0)
    if (at >= target) return
    await reveal()
    await next()
    await presenter.waitForTimeout(150)
  }
}

/* --------------------------- Ana joins at Q1 --------------------------- */

// A phone-sized viewport: the participant view is the mobile-first one (spec §7.1).
const anaCtx = await browser.newContext({ viewport: { width: 375, height: 812 } })
const ana = await anaCtx.newPage()
ana.on('console', (m) => m.type() === 'error' && console.log('  [ana]', m.text()))

// Through the real join form, not a deep link — that is the path a phone takes.
await ana.goto(`${BASE}/quiz?code=${code}`)
await ana.getByLabel('Your name').fill('Ana')
await ana.getByRole('button', { name: 'Join' }).click()
await ana.waitForSelector('text=Waiting for the presenter to start', { timeout: 20000 })
check('join form lands in the room and waits for the presenter', true)

await presenter.waitForSelector('text=Ana', { timeout: 15000 })
check('Ana appears in the presenter lobby', true)

/* ------------------------------ Q1: single ------------------------------ */

await presenter.getByRole('button', { name: 'Start quiz' }).click()
await waitForQuestion(ana, 1)

check(
  'Submit is disabled before anything is picked',
  await ana.locator('[data-testid="submit"]').isDisabled(),
)
check('single-answer question says "Pick 1"', (await ana.innerText('body')).includes('Pick 1'))
check('no horizontal scroll on the question view at 375px', await noSideScroll(ana))

const clock1 = (await ana.innerText('body')).match(/0:(\d\d)/)?.[1]
check('countdown is running from the 45s default', Number(clock1) > 35 && Number(clock1) <= 45, `0:${clock1}`)

await ana.locator(`[data-testid="opt-${KEY[0][0]}"]`).click()
check(
  'Submit enables once exactly 1 is picked',
  await ana.locator('[data-testid="submit"]').isEnabled(),
)
await ana.locator('[data-testid="submit"]').click()
await ana.waitForSelector('text=Answer sent', { timeout: 10000 })
await presenter.waitForFunction(() => document.body.innerText.includes('1 / 1'), { timeout: 15000 })
check('Q1 answer reached the presenter', true, '1 / 1')

await reveal()
await ana.waitForSelector('text=✓ your pick', { timeout: 10000 })
const revealBody = await ana.innerText('body')
check('reveal tells Ana she was right', revealBody.includes('Correct'), 'and marks ✓ your pick')

/* ------------------- Q2 + reconnect mid-question ------------------- */

await next()
await waitForQuestion(ana, 2)
await ana.locator('[data-testid="opt-3"]').click() // deliberately wrong
await ana.locator('[data-testid="submit"]').click()
await ana.waitForSelector('text=Answer sent', { timeout: 10000 })

log('reloading Ana mid-question…')
await ana.reload()
await waitForQuestion(ana, 2)
check('Ana re-syncs straight back onto the open question', true)

const anaBodyAfterReload = await ana.innerText('body')
check(
  'her recorded answer is still shown after the reload',
  anaBodyAfterReload.includes('Answer sent'),
)

// The whole point: same clientId → same row, so the denominator stays at 1.
await presenter.waitForTimeout(1500)
const denom = (await presenter.innerText('body')).match(/(\d+) \/ (\d+)\s*\n?\s*answered/)?.[2]
check('reconnect did NOT create a duplicate participant', denom === '1', `present = ${denom}`)

// Answer changes are allowed while the question is open (spec §6).
await ana.locator(`[data-testid="opt-${KEY[1][0]}"]`).click()
await ana.locator('[data-testid="submit"]').click()
await presenter.waitForTimeout(500)
await reveal()
await ana.waitForSelector('text=✓ your pick', { timeout: 10000 })
check('changed answer counted — reveal says correct', (await ana.innerText('body')).includes('Correct'))

/* ------------------------- Ben joins late at Q7 ------------------------- */

await next()
await advanceTo(7)
check('presenter is on Q7', /Question 7 of 13/i.test(await presenter.innerText('body')))

const benCtx = await browser.newContext()
const ben = await benCtx.newPage()
ben.on('console', (m) => m.type() === 'error' && console.log('  [ben]', m.text()))
await ben.goto(`${BASE}/quiz?code=${code}`)
await ben.getByLabel('Your name').fill('Ben')
await ben.getByRole('button', { name: 'Join' }).click()

await waitForQuestion(ben, 7)
const benBody = await ben.innerText('body')
check('late joiner lands directly on the open question', /Question 7 of 13/i.test(benBody), 'Q7')
check('late joiner never sees the questions they missed', !/Question 1 of 13/i.test(benBody))

await ben.locator(`[data-testid="opt-${KEY[6][0]}"]`).click()
await ben.locator('[data-testid="submit"]').click()
await presenter.waitForFunction(() => /1 \/ 2\s*\n?\s*answered|2 \/ 2/.test(document.body.innerText), {
  timeout: 15000,
})
check('late joiner is counted against presence, not ignored', true)

/* -------------------- Q10: multi-select enforcement -------------------- */

await reveal()
await next()
await advanceTo(10)
await waitForQuestion(ana, 10)
check('multi question says "Pick 2"', (await ana.innerText('body')).includes('Pick 2'))

await ana.locator('[data-testid="opt-0"]').click()
check(
  'Submit stays disabled with only 1 of 2 picked',
  await ana.locator('[data-testid="submit"]').isDisabled(),
  await ana.locator('[data-testid="submit"]').innerText(),
)
await ana.locator('[data-testid="opt-1"]').click() // one right (0), one wrong (1)
check(
  'Submit enables at exactly 2 picks',
  await ana.locator('[data-testid="submit"]').isEnabled(),
)
await ana.locator('[data-testid="submit"]').click()
await presenter.waitForTimeout(600)

await reveal()
await ana.waitForSelector('text=Not quite', { timeout: 10000 })
const multiReveal = await ana.innerText('body')
check(
  'multi-select is all-or-nothing — one of two reads as wrong',
  multiReveal.includes('Not quite'),
)
check(
  'each of her picks is marked individually',
  multiReveal.includes('✓ your pick') && multiReveal.includes('✗ your pick'),
)
check('the missed correct option is still shown', multiReveal.includes('✓ correct'))

/* ------------------------------ finish out ------------------------------ */

await next()
await advanceTo(13)
await reveal()
await next()

/* ---------------------------- final review ---------------------------- */

await ana.waitForSelector('text=/quiz complete/i', { timeout: 20000 })
await ben.waitForSelector('text=/quiz complete/i', { timeout: 20000 })

const anaFinal = await ana.innerText('body')
log('Ana:', anaFinal.match(/(\d+)\s*\/ 13[\s\S]{0,60}/)?.[0].replace(/\s+/g, ' '))
check('Ana gets a final review with a total out of 13', /\/ 13/.test(anaFinal))
check('no horizontal scroll on the final review at 375px', await noSideScroll(ana))
check('Ana scored her 2 correct singles', /\b2\s*\/ 13/.test(anaFinal.replace(/\s+/g, ' ')))

const benFinal = await ben.innerText('body')
log('Ben:', benFinal.match(/(\d+)\s*\/ 13[\s\S]{0,80}/)?.[0].replace(/\s+/g, ' '))
check(
  'late joiner is not marked wrong on questions he never saw',
  /12 unanswered/.test(benFinal.replace(/\s+/g, ' ')),
  benFinal.replace(/\s+/g, ' ').match(/\d+% · \d+ wrong · \d+ unanswered/)?.[0],
)
check('late joiner scored only on what he answered', /1\s*\/ 13/.test(benFinal.replace(/\s+/g, ' ')))
check(
  'the blank explainer appears for the late joiner',
  benFinal.includes('aren’t counted as wrong'),
)

// Expand Q1 on Ben's review: it must read blank, with the "didn't answer" copy.
// The accessible name starts with the status glyph (“–”), so match on Q1 within it.
await ben.getByRole('button', { name: /Q1\b/ }).first().click()
await ben.waitForSelector('text=You didn’t answer this one', { timeout: 5000 })
check('an unanswered question reads blank, not wrong', true, 'Q1 → “You didn’t answer this one.”')

// And the presenter's grid agrees: two rows, no duplicates.
const rows = await presenter.locator('table tbody tr').count()
check('presenter grid has exactly 2 participants', rows === 2, `${rows} rows`)
const gridText = (await presenter.innerText('table')).replace(/\s+/g, ' ')
log('grid:', gridText)

await browser.close()
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nAll checks passed.')
process.exit(fails.length ? 1 : 0)
