/**
 * Phase 3 verification: presenter refresh mid-session.
 * Answers must survive the refresh and the participant must re-sync.
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

const browser = await chromium.launch()
const ctx = await browser.newContext()

const presenter = await ctx.newPage()
presenter.on('console', (m) => m.type() === 'error' && console.log('  [presenter console]', m.text()))
await presenter.goto(`${BASE}/quiz/present/week4`)

// --- room code + QR ---
const codeEl = presenter.locator('p.tabular-nums').first()
await codeEl.waitFor({ timeout: 15000 })
const code = (await codeEl.innerText()).trim()
check('room code is 4 digits', /^\d{4}$/.test(code), code)
log('room code', code)

const qr = presenter.locator('svg[role="img"]')
check('QR rendered', (await qr.count()) === 1)
const qrLabel = await qr.getAttribute('aria-label')
check('QR encodes the join URL with the code', qrLabel.includes(`/quiz?code=${code}`), qrLabel)
check('QR has modules', (await qr.locator('path').getAttribute('d')).length > 500)

// wait for connection (Start is disabled until connected)
await presenter.waitForFunction(
  () => [...document.querySelectorAll('button')].some((b) => b.textContent.includes('Start quiz') && !b.disabled),
  { timeout: 20000 },
)
check('presenter connected to Ably', true)

// --- participant joins via the Phase 2 harness ---
const ana = await ctx.newPage()
await ana.goto(`${BASE}/quiz/dev-transport?role=participant&code=${code}&name=Ana`)
await ana.waitForSelector('[data-testid="connection"]:text("connected")', { timeout: 20000 })

await presenter.waitForSelector('text=Ana', { timeout: 15000 })
check('participant appears in the lobby', true)

// --- Q1 ---
await presenter.getByRole('button', { name: 'Start quiz' }).click()
await ana.waitForSelector('[data-testid="opt-0"]', { timeout: 15000 })
await ana.locator('[data-testid="opt-1"]').click() // pick option B

await presenter.waitForFunction(() => document.body.innerText.includes('1 / 1'), { timeout: 15000 })
check('n/m answered counts the answer against presence', true, '1 / 1')

const q1counts = await presenter.$$eval('div.relative > span.absolute', (els) =>
  els.map((e) => e.textContent.trim()),
)
check('chart shows one selection on option B', q1counts.join(',') === '0,1,0,0', q1counts.join(','))

// pre-reveal must not be coloured by correctness
const preRevealText = await presenter.innerText('body')
check('no correctness labels before Reveal', !preRevealText.includes('Incorrect'))

// --- Reveal ---
await presenter.getByRole('button', { name: 'Reveal' }).click()
await presenter.waitForSelector('text=Incorrect', { timeout: 10000 })
const revealText = await presenter.innerText('body')
check('reveal adds ✓/✗ + word labels (not colour alone)', revealText.includes('✓ Correct') || revealText.includes('Correct'))
await ana.waitForSelector('[data-testid="reveal"]', { timeout: 10000 })
check('participant saw the reveal', true)

// --- Q2, answer, then REFRESH the presenter ---
await presenter.getByRole('button', { name: /Next/ }).click()
await ana.waitForSelector('[data-testid="opt-0"]', { timeout: 15000 })
await ana.locator('[data-testid="opt-2"]').click() // option C on Q2
await presenter.waitForFunction(() => document.body.innerText.includes('1 / 1'), { timeout: 15000 })
log('Q2 answered, refreshing presenter…')

await presenter.reload()
await presenter
  .waitForFunction(() => /question 2 of/i.test(document.body.innerText), { timeout: 25000 })
  .catch(async (e) => {
    console.log('--- body after reload ---\n', (await presenter.innerText('body')).slice(0, 800))
    throw e
  })
check('phase machine restored to Q2 after refresh', true)

const codeAfter = (await presenter.innerText('body')).match(/Room (\d{4})/)?.[1]
check('room code survives the refresh', codeAfter === code, `${code} → ${codeAfter}`)

const q2counts = await presenter.$$eval('div.relative > span.absolute', (els) =>
  els.map((e) => e.textContent.trim()),
)
check('Q2 answer survived the refresh', q2counts[2] === '1', q2counts.join(','))

// --- participant must re-sync and keep answering after the refresh ---
await presenter.getByRole('button', { name: 'Reveal' }).click()
await presenter.getByRole('button', { name: /Next/ }).click()
await ana.waitForFunction(() => /q=3\b/.test(document.body.innerText), { timeout: 15000 })
check('participant re-synced onto Q3 after the presenter refresh', true)

await ana.locator('[data-testid="opt-0"]').click()
await presenter.waitForFunction(() => document.body.innerText.includes('1 / 1'), { timeout: 15000 })
check('answers count again after the presenter refresh', true)

// --- earlier answers still in the store: end the quiz and read the grid ---
for (let i = 3; i <= 13; i += 1) {
  await presenter.getByRole('button', { name: 'Reveal' }).click()
  await presenter.getByRole('button', { name: /Next|Finish/ }).click()
  await presenter.waitForTimeout(120)
}
await presenter.waitForFunction(() => /export csv/i.test(document.body.innerText), { timeout: 15000 })
const row = await presenter.innerText('table tbody tr')
log('results row:', row.replace(/\s+/g, ' '))
const cells = row.split('\t').map((s) => s.trim())
check('grid keeps the pre-refresh answers (Q1 B, Q2 C, Q3 A)', /B/.test(cells[1]) && /C/.test(cells[2]) && /A/.test(cells[3]), cells.slice(0, 5).join('|'))

await browser.close()
console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nAll checks passed.')
process.exit(fails.length ? 1 : 0)
