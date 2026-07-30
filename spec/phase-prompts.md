# Phase kickoff prompts

Copy-paste one of these into a fresh Claude Code session started in
`/Users/rohitfun/git/buildfoundation-aws-2026`.

**Order:** run these strictly in sequence, 0 → 7, one session at a time. Each phase builds on the
files the previous one left behind, so don't start a phase until the one before it is done.

**Branch:** everything lands on `week4-updates`, the current branch. No feature branches — which is
why the phases must not overlap.

---

## Phase 0 — Data & scoring *(no blockers, can start now)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first — they are the
authority for this work.

Implement Phase 0 only (Data & scaffolding). Do not start any other phase.

Scope:
- Move spec/week4-quiz-questions.json into v2/src/data/quizzes/, conformed to the schema in
  spec §5: add top-level id/title/subtitle/defaults, and add "selections": 1 to the 9
  single-answer questions (the 4 multi-select ones already have "selections": 2).
- Split it as described in the plan's Phase 0: week4.json (prompts + options) and
  week4.answers.json (correct indices only). The answers file must be importable on its own so
  the presenter route can lazy-import it — see spec §8 for why.
- Add v2/src/data/quizzes/index.js: a registry mapping quizId -> { meta, loadQuestions() }.
  Adding a future quiz must mean dropping a JSON file plus one registry line, nothing else.
- Add v2/src/quiz/scoring.js with pure functions isCorrect(question, selected) and
  scoreParticipant(quiz, answers). Multi-select is all-or-nothing (set equality).

Verify with unit tests covering all 13 Week 4 questions, and specifically:
- a multi-select answer with one of two correct scores WRONG
- an unanswered question scores BLANK, not wrong

Check whether v2 already has a test runner configured before adding one; match what's there.
Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask. Report what you built and the test output.
```

## Phase 1 — Routes & static views *(no blockers, can start now)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first — they are the
authority for this work.

Implement Phase 1 only (Routes & static views). Do not start any other phase, and do not add
Ably or any networking — this phase is built entirely against mock local state.

Scope:
- Register the four routes from spec §4 in v2/src/App.jsx.
- Build every view from spec §7 against mocked state: participant join, question, reveal,
  final review; presenter lobby, question, results.
- Mobile-first. The laptop layout is the same layout scaled up, not a separate design.
  Tap targets >= 44px. Cap max-width so it doesn't sprawl on a laptop.

Hard constraint from CLAUDE.md: all internal navigation must use react-router <Link> or
navigate(). A raw <a href="/..."> drops import.meta.env.BASE_URL and 404s on GitHub Pages.

Leave the bar chart as a placeholder — it's Phase 3 and needs the dataviz skill.

Verify by running the dev server (cd v2 && npm run dev) and clicking through every phase at
375px and 1440px. No horizontal page scroll at either width.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 2 — Ably transport *(needs your `quiz:*`-scoped key pasted in)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first — they are the
authority for this work. Phases 0 and 1 are done, on this branch.

Implement Phase 2 only (Ably transport layer).

My Ably key is: <PASTE KEY HERE>

Before using it, confirm it is scoped to the quiz:* channel namespace with publish, subscribe
and presence only. If it's a root/full-access key, tell me — I'll create a scoped one in the
Ably dashboard rather than ship an unrestricted key in a public bundle.

Scope:
- npm i ably in v2/
- v2/src/config/ably.js — key plus the quiz:* namespace constant
- v2/src/quiz/useQuizChannel.js — one hook wrapping attach, presence, publish, subscribe and
  teardown. Every event in spec §6 lives here (state, reveal, ended, join, answer, sync). No
  component may import the Ably SDK directly.
- Surface connection state to the UI explicitly: connecting | connected | reconnecting | failed.
  Never a silent hang.

Honour the protocol rules in spec §6 exactly — especially: correct answers are NOT in the
state payload, only in reveal; late join is allowed; answer changes allowed while
phase === "question", last write wins per (clientId, qIndex).

Verify with two browser windows (presenter + participant) through a full 13-question run, and
confirm the offline case shows the failed state with a retry rather than hanging.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 3 — Presenter console *(needs Phase 2)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first. Phases 0-2 are
done, on this branch; use the existing useQuizChannel hook rather than touching Ably directly.

Implement Phase 3 only (Presenter console).

Scope:
- Room code generation (4-digit, nonce-derived per spec §8) and a client-side QR code
- Phase machine: lobby -> question(qIndex) -> reveal(qIndex) -> ... -> ended
- Live answer-distribution bar chart. Load the dataviz skill BEFORE writing any chart code.
  It must be legible when projected: large type, high contrast. Do not colour bars by
  correctness until Reveal is pressed.
- "n / m answered" against the Ably presence count
- sessionStorage mirror of the answer store, restored on mount if the room code matches
  (spec §7.4 — this is a crash guard, not persistence)
- beforeunload warning while a session is live

Verify by refreshing the presenter tab mid-session: answers must survive and participants must
re-sync.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 4 — Participant experience *(needs Phase 3)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first. Phases 0-3 are
done, on this branch; use the existing useQuizChannel hook rather than touching Ably directly.

Implement Phase 4 only (Participant experience).

Scope:
- Join (room code + display name); clientId in sessionStorage so a reconnect rejoins as the
  same person instead of creating a duplicate row
- Answer input enforcing exactly `selections` picks; Submit disabled until satisfied
- Countdown from endsAt. Input locks at zero but does NOT auto-advance — the presenter drives.
  Render remaining time relative to when this client received the state message, not by
  trusting absolute clock agreement (see the plan's risk register).
- Reveal feedback: whether they were right, and the correct option(s). Multi-select shows each
  of their picks marked individually.
- Final review: per-question right/wrong, their answer vs the correct one, and their total.
  Computed locally from data the participant already has.

Verify: join at Q1, join late at Q7, and reconnect mid-question. No duplicate participant rows,
and a late joiner's unanswered questions must read blank rather than wrong.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 5 — Presenter gate *(blocked: needs the passphrase)*

```
Read spec/live-quiz-spec.md — especially §8 — and the implementation plan. Phases 0-4 are
done, on this branch.

Implement Phase 5 only (Presenter gate).

The SHA-256 hash of my passphrase is: <PASTE HASH HERE>
(generate with: printf '%s' 'your passphrase' | shasum -a 256)

Scope:
- Gate /quiz/present on a Web Crypto SHA-256 check against that committed hash. The passphrase
  itself must never appear in the bundle.
- Feed the passphrase into the room-code derivation so a third party cannot publish presenter
  events into a running room.
- Add a code comment stating plainly that this is a client-side gate and is bypassable by
  anyone reading the bundle, so nobody later mistakes it for real authentication.

Do not overstate this in any UI copy — it is not authentication.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 6 — Results & CSV export *(needs Phase 3)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first. Phases 0-5 are
done, on this branch.

Implement Phase 6 only (Results & CSV export).

Scope:
- Per-participant answer grid: rows = participants, columns = Q1..Q13, cells = chosen option
  letters with a correct/incorrect mark, plus a score column
- CSV export via a client-side Blob download. Columns per spec §7.3:
  name, joinedAt, q1..q13, q1_correct..q13_correct, score, percent
  Filename: quiz-<quizId>-<YYYYMMDD-HHmm>.csv
- CSV injection guard: prefix any participant name starting with = + - or @ with a single
  quote. Names are free text and land in Excel.

Verify by exporting a session containing a name with a comma, a name with a double quote, and
a name like =cmd|'/c calc'!A1 — then open the file in Sheets and confirm the grid matches what
is on screen.

Work directly on the current branch (week4-updates) — do not create a branch. Do not commit
or push unless I ask.
```

## Phase 7 — Build, deploy, docs *(needs everything)*

```
Read spec/live-quiz-spec.md and spec/live-quiz-implementation-plan.md first. Phases 0-6 are
done, on this branch.

Implement Phase 7 only (Build, deploy, docs).

Scope:
- Build and sync to the repo root following the exact steps in CLAUDE.md
  (cd v2 && npx vite build --base=/buildfoundation-aws-2026/, then the copy steps, and refresh
  404.html as a copy of index.html — that is what makes deep links survive on Pages).
- After deploying, verify on the live Pages URL: load /quiz directly, load /quiz/present
  directly, and refresh mid-session. This deep-link case is exactly what 404.html exists for.
- Add a README section: how to run a session, how to rotate the Ably key, and the spec §8
  caveats about what the passphrase and answer-hiding do and do not protect.
- Update CLAUDE.md with the "adding a future quiz" steps from spec §4.

Ask me before pushing — this one is user-facing.
```
