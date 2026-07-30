# Live Quiz — Implementation Plan

Companion to `spec/live-quiz-spec.md`. Read that first — this file assumes its decisions.

---

## Blockers before coding starts

| # | Blocker | Owner | Needed by |
|---|---|---|---|
| 1 | Ably account exists. Still needed: a key **scoped to `quiz:*`** (publish, subscribe, presence) rather than a root key | **Rohit** | Phase 2 |
| 2 | Presenter passphrase chosen (long — see spec §8) | **Rohit** | Phase 5 |

Phases 0–1 can proceed without either. Phase 2 onward can be built against a placeholder key and a
local Ably sandbox, but cannot be verified end-to-end until #1 lands.

---

## Phase 0 — Data & scaffolding *(no dependencies)*

- `v2/src/data/quizzes/week4.json` — move `spec/week4-quiz-questions.json` into the app, conformed to
  the §5 schema: add top-level `id`/`title`, add `selections: 1` to the 9 single-answer questions
  (the 4 multi-select ones already carry `selections: 2`).
- `v2/src/data/quizzes/index.js` — registry mapping `quizId → { meta, loadQuestions() }`.
  **Questions and answers split here:** `week4.json` (prompts + options, eagerly importable) and
  `week4.answers.json` (correct indices, `import()`-ed only from the presenter route) — spec §8.
- `v2/src/quiz/scoring.js` — pure functions: `isCorrect(question, selected)` (set equality for
  `multi`, all-or-nothing), `scoreParticipant(quiz, answers)`.

**Verify:** unit-test `scoring.js` against all 13 Week 4 questions, including a `multi` case with one
of two correct (must score wrong) and an unanswered question (must score blank, not wrong).

## Phase 1 — Routes & static views *(no dependencies)*

- Register the four routes from spec §4 in `v2/src/App.jsx`. `<Link>`/`navigate()` only — a raw
  `<a href>` drops the `basename` and 404s on Pages (`CLAUDE.md`).
- Build all views against **mock local state**, no network: join form, question, reveal, final review,
  presenter lobby, presenter question, presenter results.
- Mobile-first; laptop is the same layout scaled up. Tap targets ≥44px.

**Verify:** click through every phase with mocked state, at 375px and 1440px. No horizontal scroll.

## Phase 2 — Ably transport layer *(blocked on Ably key)*

- `npm i ably` in `v2/`.
- `v2/src/config/ably.js` — key + `quiz:*` namespace constant.
- `v2/src/quiz/useQuizChannel.js` — one hook wrapping attach, presence, publish, subscribe, teardown.
  All protocol knowledge from spec §6 lives here; no component touches the Ably SDK directly.
- Implement events: `state`, `reveal`, `ended`, `join`, `answer`, `sync`.
- Explicit connection states surfaced to the UI: `connecting | connected | reconnecting | failed`.

**Verify:** two browser windows, one presenter + one participant, full 13-question run.

## Phase 3 — Presenter console *(depends on 2)*

- Room code generation (4-digit, nonce-derived per spec §8), QR code rendered client-side.
- Phase machine: lobby → question(qIndex) → reveal(qIndex) → … → ended.
- Live answer-distribution bar chart. **Load the `dataviz` skill before writing chart code.** Must be
  legible projected: large type, high contrast, correct/incorrect colouring only after Reveal.
- `n / m answered` against the presence count.
- `sessionStorage` mirror of the answer store + restore-on-mount (spec §7.4).
- `beforeunload` warning while a session is live.

**Verify:** refresh the presenter mid-session — answers survive, participants re-sync.

## Phase 4 — Participant experience *(depends on 2)*

- Join (code + name), `sessionStorage` `clientId` so reconnects don't duplicate a row.
- Answer input enforcing exactly `selections` picks; Submit disabled until satisfied.
- Countdown from `endsAt`; input locks at zero, but **no auto-advance**.
- **Reveal feedback** — right/wrong + the correct option(s), multi-select picks marked individually.
- **Final review** — per-question right/wrong, their answer vs correct, and total.
- Late-join and reconnect paths.

**Verify:** join at Q1, at Q7, and reconnect mid-question. Confirm no duplicate participant rows and
that a late joiner's unanswered questions read blank rather than wrong.

## Phase 5 — Presenter gate *(blocked on passphrase)*

- SHA-256 (Web Crypto) check against a committed hash; passphrase never in the bundle.
- Passphrase feeds room-code derivation (spec §8).
- **A code comment stating plainly that this is a client-side gate and bypassable** — so nobody later
  mistakes it for real auth.

## Phase 6 — Results & CSV export *(depends on 3)*

- Per-participant grid: rows = participants, cols = Q1…Q13, cells = chosen letters + correct mark,
  plus score column.
- CSV via Blob download, columns per spec §7.3, filename `quiz-<quizId>-<YYYYMMDD-HHmm>.csv`.
- **CSV injection guard:** prefix any participant name starting with `= + - @` with `'` — names are
  free text and land in Excel.

**Verify:** export a session with a comma, a quote, and a `=cmd` name; open in Sheets and confirm the
grid matches the on-screen one.

## Phase 7 — Build, deploy, docs

- `cd v2 && npx vite build --base=/buildfoundation-aws-2026/`, sync to repo root, refresh `404.html`
  (exact steps in `CLAUDE.md`).
- **Deep-link check on the real Pages URL** — `/quiz`, `/quiz/present`, and a refresh mid-session.
  This is the failure mode `404.html` exists to catch.
- README section: how to run a session, how to rotate the Ably key, and the spec §8 caveats.
- Update `CLAUDE.md` with the "adding a future quiz" steps (spec §4).

---

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Ably free-tier limits hit | Very low | 6M msgs/mo vs ~2k per session |
| Presenter tab closed → results lost | Medium | `beforeunload` warning; export prompt at `ended` |
| Participant on hostile wifi | Low | Ably is plain WSS on 443; falls back to HTTP streaming |
| Answers read from bundle | **Certain if attempted** | Accepted, documented (spec §8) |
| Presenter gate bypassed | **Certain if attempted** | Accepted, documented (spec §8) |
| Clock skew breaks countdown | Low | Broadcast `endsAt` as a server-ish epoch from the presenter and render remaining time relative to each client's own receipt of `state`, rather than trusting absolute clock agreement |

## Test matrix

| Scenario | Phase |
|---|---|
| Full 13-question run, 2 participants | 2 |
| Multi-select scored all-or-nothing | 0 |
| Late joiner at Q7 | 4 |
| Participant reconnect mid-question | 4 |
| Presenter refresh mid-session | 3 |
| Ably unreachable (offline) | 2 |
| CSV with injection-shaped name | 6 |
| Deep-link + refresh on live Pages URL | 7 |

## Rough sequencing

Run strictly 0 → 7, one at a time, all on the `week4-updates` branch. Phases 0 and 1 need nothing
from you and are the bulk of the UI work; 2 needs the scoped Ably key and 5 needs the passphrase.
Kickoff prompts for each phase are in `spec/phase-prompts.md`.
