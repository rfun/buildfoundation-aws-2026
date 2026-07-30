# Live Quiz — Specification

**Status:** draft for approval · **Author:** Claude · **Date:** 2026-07-26
**Scope:** A presenter-driven live quiz for The Build Fellowship AWS course, replacing Mentimeter for
in-session quizzes. First quiz: Week 4 (`AWS Core Concepts`, 13 questions).

---

## 1. Goals

1. Presenter runs a live, lockstep quiz from the course site; participants answer on their phones/laptops.
2. Presenter sees, live, how many have answered and the distribution of answers.
3. On reveal, **participants see whether they were right** and what the correct answer was.
4. At the end, **participants see their own per-question right/wrong review**.
5. Presenter sees a **per-participant answer grid** and can **export it as CSV**.
6. **The site stays statically hosted on GitHub Pages.** No server, no build-time secrets service.
7. The quiz system is **reusable** — Week 5+ quizzes are added as data files, not new code.

### Non-goals (explicitly out of scope)

- Server-side persistence. Results live in the presenter's browser for the duration of the session.
- Leaderboard / time-based scoring. (Mentimeter's `Time-based` score allocation is **not** carried over —
  scoring is a simple correct-answer count. Raising this later is a small additive change.)
- Accounts, authentication, or identity beyond a self-declared display name.
- Moderation of participant-entered names.

---

## 2. Constraint that shapes everything

GitHub Pages serves static files only. It cannot run a WebSocket server, cannot hold a secret, and
cannot validate a password. Therefore:

- Realtime comes from a **third-party managed WebSocket service (Ably)**.
- Everything in the deployed bundle is **readable by anyone**, including the Ably key, the quiz
  questions, and the correct answers.

Section 8 states precisely what this does and does not protect.

---

## 3. Transport: Ably

Chosen after a cost check (2026-07-26):

| | Free limits | Verdict |
|---|---|---|
| **Ably** *(chosen)* | 6M msgs/month, 200 concurrent connections, 200 channels, 500 msg/s | No inactivity pause. A 10-person, 13-question session uses on the order of 2,000 messages — 0.03% of the monthly allowance. |
| Supabase | 2M msgs/month, 200 concurrent connections | Rejected: **free projects pause after 1 week of inactivity**, so a weekly class would need a manual un-pause before each session. |
| PeerJS/WebRTC | unlimited, no account | Rejected: no TURN server, so a participant on restrictive wifi can fail to connect with no fallback — unrecoverable mid-class. |

**Key scoping.** One Ably API key, restricted at the Ably dashboard to the channel namespace
`quiz:*` with capabilities `publish`, `subscribe`, `presence` only. It is committed to the repo
(`v2/src/config/ably.js`) and shipped in the bundle. Blast radius of a leak: someone can publish
noise into a quiz channel. Mitigation: rotate the key in the Ably dashboard, redeploy. Document this
in the README.

---

## 4. Information architecture

The quiz is a **standalone, reusable section**, not Week-4-specific.

| Route | View | Notes |
|---|---|---|
| `/quiz` | Participant join | Enter room code + display name. Default landing for the QR code. |
| `/quiz/room/:code` | Participant play | Live question, answer, reveal feedback, final review. |
| `/quiz/present` | Presenter picker | Passphrase gate, then choose which quiz to run. |
| `/quiz/present/:quizId` | Presenter console | Lobby → questions → results → export. |

All routes are registered in `v2/src/App.jsx` and **must** use react-router `<Link>` / `navigate()`,
never raw `<a href>`, per `CLAUDE.md` (the `basename` would be dropped and 404 on Pages).

Neither `/quiz` nor `/quiz/present` is linked from the site navigation or the Week 4 page. They are
reachable by URL and QR code only.

### Adding a future quiz

1. Drop `v2/src/data/quizzes/weekN.json` (schema in §5).
2. Register it in `v2/src/data/quizzes/index.js`.

No component changes. This is the reusability requirement.

---

## 5. Quiz data schema

Authoritative extraction of the Week 4 quiz already exists at `spec/week4-quiz-questions.json`
(13 questions, pulled from Mentimeter presentation `alak7jsvep883pnwt1yazcq4rzyi4w3c` on 2026-07-26).
It moves to `v2/src/data/quizzes/week4.json` during implementation.

```jsonc
{
  "id": "week4",
  "title": "AWS Core Concepts",
  "subtitle": "Modeled after AWS Cloud Practitioner Exam questions",
  "defaults": { "timeToRespondSeconds": 45 },
  "questions": [
    {
      "id": 1,
      "type": "single",          // "single" | "multi"
      "selections": 1,           // required selections; 2 for the "Choose TWO" questions
      "prompt": "…",
      "options": ["…", "…", "…", "…"],
      "correct": [3]             // zero-based indices into options
    }
  ]
}
```

Week 4 contains **9 single-answer** and **4 multi-select ("Choose TWO")** questions. The participant
UI must enforce `selections` exactly — Submit stays disabled until exactly N options are chosen —
and scoring for `multi` is **all-or-nothing** (set equality), matching Mentimeter's behaviour.

Default timer is **45 seconds**, carried over from the Mentimeter `Time to respond` setting.

---

## 6. Session protocol

One Ably channel per session: `quiz:<code>`, where `<code>` is a 4-digit room code.

Ably `clientId` = a random UUID generated per participant and kept in `sessionStorage`, so a refresh
or a dropped connection rejoins as the same person rather than creating a duplicate row.

### Presenter → channel

| Event | Payload | When |
|---|---|---|
| `state` | `{ quizId, phase, qIndex, endsAt, revealed }` | On every phase change, **and** in reply to `sync` |
| `reveal` | `{ qIndex, correct: number[] }` | When the presenter clicks Reveal |
| `ended` | `{ }` | End of quiz; participants switch to their review screen |

`phase` ∈ `lobby` | `question` | `reveal` | `ended`.

Correct answers are **only** broadcast at reveal time — they are not in the `state` payload. (See §8
for why this is a speed bump, not a guarantee.)

### Participant → channel

| Event | Payload |
|---|---|
| `join` | `{ clientId, name }` |
| `answer` | `{ clientId, qIndex, selected: number[], at }` |
| `sync` | `{ clientId }` — sent on connect/reconnect; presenter replies with current `state` |

### Rules

- **Late join** is allowed at any point. A late joiner gets current `state` via `sync` and is scored
  only on questions answered; unanswered questions record as blank, not wrong.
- **Answer changes** are allowed while `phase === "question"`; last write wins on `(clientId, qIndex)`.
- Once `phase` moves to `reveal`, further `answer` events for that `qIndex` are ignored by the presenter.
- **Timer expiry** does not auto-advance. `endsAt` drives a countdown on both views; when it hits zero
  the participant UI locks input, but the presenter still clicks Reveal/Next explicitly. This keeps
  discussion time flexible.
- **Presence** (Ably presence set) drives the lobby's connected-participant list.

---

## 7. Views

### 7.1 Participant

```
JOIN                 QUESTION              REVEAL                 FINAL REVIEW
+-------------+      +---------------+     +---------------+      +-----------------+
| Room code   |      | Q4 of 13 0:32 |     | Q4 of 13      |      | You: 9 / 13     |
| [ 4821    ] |      | Pick 1        |     | x Your answer |      | Q1  correct     |
| Your name   |      | ( ) Option A  |     |   Option B    |      | Q2  wrong       |
| [ Rohit   ] |      | (o) Option B  |     | / Correct     |      | Q3  correct     |
| [  Join   ] |      | ( ) Option C  |     |   Option D    |      |  … expandable   |
+-------------+      | [  Submit   ] |     | Waiting for   |      +-----------------+
                     +---------------+     | presenter…    |
                                           +---------------+
```

Mobile-first. The laptop layout is the same layout at a larger scale — no separate desktop design.
Requirements: single-column, tap targets ≥44px, `max-width` cap so it doesn't sprawl on a laptop.

- **Reveal feedback (required):** the participant immediately sees whether they were right and which
  option was correct. Multi-select shows both of their picks marked individually.
- **Final review (required):** per-question right/wrong list with their answer and the correct answer,
  plus their total. Computed locally from data the participant already received.

### 7.2 Presenter

```
LOBBY                        QUESTION                        RESULTS
+---------------------+      +----------------------+        +--------------------------+
| Code 4821  [QR]     |      | Q4 of 13       0:32  |        | Name    1 2 3 … 13  Score|
| Joined (7)          |      | prompt text…         |        | Rohit   / x / … /    9/13|
|  Rohit, Ana, …      |      | [live bar chart]     |        | Ana     / / x … x    8/13|
|                     |      | 6 / 7 answered       |        | …                        |
| [ Start quiz ]      |      | [ Reveal ] [ Next > ]|        | [ Export CSV ]           |
+---------------------+      +----------------------+        +--------------------------+
```

- Live bar chart of answer distribution, updating as answers arrive. Option labels are **not**
  colour-coded by correctness until Reveal is pressed.
- `n / m answered` counter against the presence count.
- Reveal marks the correct bar(s) green, incorrect red, mirroring the Mentimeter look.
- The presenter is the only client that ever holds the full per-participant answer set.
- Charts follow the `dataviz` skill; the presenter console must be legible when projected
  (large type, high contrast).

### 7.3 Results & export

- **Per-participant answer grid** — rows = participants, columns = Q1…Q13, cells = chosen option
  letters with a correct/incorrect mark, plus a score column.
- **CSV export** — `name, joinedAt, q1..q13, q1_correct..q13_correct, score, percent`.
  Filename `quiz-<quizId>-<YYYYMMDD-HHmm>.csv`, generated client-side via a Blob download.

JSON export and a projected leaderboard were considered and dropped — not requested.

### 7.4 Presenter state safety net

There is no persistence by design, but losing a whole session to an accidental browser refresh is a
sharp edge. The presenter's answer store is therefore mirrored to `sessionStorage` on every write and
restored on mount if the room code matches. This is a crash guard, not persistence — closing the tab
still ends the session, and nothing is ever sent to a server.

---

## 8. Security — what is and is not protected

**This is the section to read before approving.** A static site cannot keep a secret. The following
are accepted risks, not oversights.

### Presenter passphrase

Requested, and implemented as follows:

1. `/quiz/present` prompts for a passphrase. It is checked against a **SHA-256 hash committed in the
   repo** — the passphrase itself is never in the bundle.
2. The passphrase is also used to **derive the room channel** (`quiz:<code>` where the code comes from
   a hash of passphrase + session nonce), so a third party cannot publish presenter events into *your*
   running room.

**What this does protect against:** a student who finds the `/quiz/present` URL and tries to open the
console, and anyone attempting to hijack a live session.

**What this does NOT protect against:** anyone who reads the JavaScript bundle can bypass the UI gate
entirely, because the check happens in code they control. A weak passphrase is also brute-forceable
offline against the committed hash — **use a long, non-obvious passphrase.**

Genuine enforcement would require a server, which conflicts with the static-hosting goal.

### Correct answers

Quiz answers ship in the static bundle and **a motivated participant can read them**. This is inherent
to static hosting. Two speed bumps, neither of which is a guarantee:

1. Answers live in a separate JSON chunk lazily imported only by the presenter route, so they are not
   in the main bundle.
2. Answers are broadcast to participants only at reveal time.

If cheat-proofing ever matters more than static hosting, the answer key has to move behind a server.

### Ably key

Public by necessity (§3). Scoped to `quiz:*` with publish/subscribe/presence. Rotatable from the Ably
dashboard.

### Participant data

Display names are participant-supplied and transit Ably's infrastructure. No email, no account, no
personal data is collected. Names are not persisted anywhere after the presenter closes the tab,
other than in a CSV the presenter chooses to download.

---

## 9. Failure handling

| Failure | Behaviour |
|---|---|
| Participant loses connection | Ably auto-reconnects; `sync` restores current state; `clientId` from `sessionStorage` prevents a duplicate row |
| Participant joins late | Allowed; scored only on questions they answered |
| Presenter refreshes | `sessionStorage` restore (§7.4); participants re-`sync` |
| Presenter closes tab | Session is over. Results are lost unless exported. **The UI warns before unload once a session is running.** |
| Ably unreachable | Explicit "can't connect" state with a retry button on both views — never a silent hang |
| Two presenters, same passphrase | Distinct room codes (nonce in derivation), so sessions do not collide |

---

## 10. Open questions

1. **Ably account** — you need to create the free account and generate the `quiz:*`-scoped key. I
   cannot do this for you (it requires signup + credentials). Implementation can proceed with the key
   read from a placeholder that you fill in.
2. **Presenter passphrase** — you choose it; I commit only its SHA-256 hash. Given §8, make it long.
3. Should the Week 4 page link to the quiz once it's built, or stay URL-only? Spec currently assumes
   URL-only.
