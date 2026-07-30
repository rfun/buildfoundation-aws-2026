/**
 * Pure scoring helpers for the live quiz. No React, no network, no I/O.
 *
 * Questions passed in here must carry `correct` (zero-based option indices) —
 * use `withAnswers()` / `loadScorableQuiz()` from `../data/quizzes` to merge the
 * answer key into the questions file first.
 */

export const CORRECT = 'correct'
export const WRONG = 'wrong'
export const BLANK = 'blank'

/** True when `selected` is a real answer rather than "not answered". */
export function isAnswered(selected) {
  return Array.isArray(selected) && selected.length > 0
}

function toSet(indices) {
  return new Set(indices.map(Number))
}

/**
 * Is `selected` the right answer to `question`?
 *
 * Multi-select is all-or-nothing: the chosen set must equal the correct set
 * exactly (spec §5). One of two correct is wrong, not half credit. Duplicate
 * picks are collapsed, order is irrelevant.
 *
 * An unanswered question is not correct — but it is also not *wrong*; use
 * `gradeQuestion` when you need to tell those two apart.
 */
export function isCorrect(question, selected) {
  if (!isAnswered(selected)) return false
  const correct = toSet(question?.correct ?? [])
  if (correct.size === 0) return false
  const chosen = toSet(selected)
  if (chosen.size !== correct.size) return false
  for (const i of chosen) {
    if (!correct.has(i)) return false
  }
  return true
}

/** `CORRECT` | `WRONG` | `BLANK` for a single question. */
export function gradeQuestion(question, selected) {
  if (!isAnswered(selected)) return BLANK
  return isCorrect(question, selected) ? CORRECT : WRONG
}

/**
 * Look up one participant's answer to a question.
 * `answers` may be an array indexed by question index (matching the wire
 * protocol's `qIndex`) or an object keyed by question `id`.
 */
function answerFor(answers, question, index) {
  if (Array.isArray(answers)) return answers[index]
  if (!answers) return undefined
  const byId = answers[question.id] ?? answers[String(question.id)]
  return byId
}

/**
 * Score one participant across a whole quiz.
 *
 * @param {{id?: string, questions: Array}} quiz  questions with `correct` merged in
 * @param {Array<number[]>|Record<string|number, number[]>} answers
 * @returns {{quizId, total, correct, wrong, blank, percent, results: Array}}
 *
 * Unanswered questions are recorded as `blank` and count against neither the
 * correct nor the wrong tally — a late joiner is scored only on what they
 * answered (spec §6).
 */
export function scoreParticipant(quiz, answers) {
  const questions = quiz?.questions ?? []
  const results = questions.map((question, index) => {
    const selected = answerFor(answers, question, index)
    const status = gradeQuestion(question, selected)
    return {
      id: question.id,
      index,
      status,
      selected: isAnswered(selected) ? [...selected].map(Number).sort((a, b) => a - b) : null,
      correct: [...(question.correct ?? [])],
    }
  })

  const tally = (status) => results.filter((r) => r.status === status).length
  const correct = tally(CORRECT)

  return {
    quizId: quiz?.id ?? null,
    total: questions.length,
    correct,
    wrong: tally(WRONG),
    blank: tally(BLANK),
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    results,
  }
}
