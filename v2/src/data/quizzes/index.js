/**
 * Quiz registry.
 *
 * Adding a quiz = drop `<quizId>.json` + `<quizId>.answers.json` in this folder
 * and add one `defineQuiz({...})` line to `quizzes` below. Nothing else changes.
 *
 * Questions and answers are deliberately separate files (spec §8): the answer key
 * is only ever reached through `loadAnswers()`, a dynamic import, so it lands in
 * its own chunk that the participant bundle never pulls in. This is a speed bump,
 * not a guarantee — anyone can fetch the chunk directly. See spec §8.
 */

// Vite resolves these to lazy chunk loaders; nothing here is in the initial bundle.
const jsonModules = import.meta.glob('./*.json')

function loadJson(path) {
  const loader = jsonModules[path]
  if (!loader) throw new Error(`Quiz data file not found: ${path}`)
  return loader().then((m) => m.default ?? m)
}

function defineQuiz(meta) {
  return {
    meta,
    /** @returns {Promise<{id, title, subtitle, defaults, questions: Array}>} prompts + options, no answers */
    loadQuestions: () => loadJson(`./${meta.id}.json`),
    /** @returns {Promise<{quizId, answers: Record<string, number[]>}>} presenter-only */
    loadAnswers: () => loadJson(`./${meta.id}.answers.json`),
  }
}

export const quizzes = {
  week4: defineQuiz({
    id: 'week4',
    title: 'AWS Core Concepts',
    subtitle: 'These questions are taken/modeled after questions that appear in AWS Cloud Practitioner Exam',
    defaults: { timeToRespondSeconds: 45 },
  }),
}

export const quizList = Object.values(quizzes).map((q) => q.meta)

export function getQuiz(quizId) {
  return quizzes[quizId] ?? null
}

/**
 * Merge an answer key into a loaded quiz, producing questions that carry `correct`.
 * Only the presenter (and a participant's own final review, post-reveal) does this.
 */
export function withAnswers(quiz, answerKey) {
  const answers = answerKey?.answers ?? {}
  return {
    ...quiz,
    questions: quiz.questions.map((q) => ({ ...q, correct: answers[String(q.id)] ?? [] })),
  }
}

/** Convenience: load questions + answers and merge them. Presenter route only. */
export async function loadScorableQuiz(quizId) {
  const entry = getQuiz(quizId)
  if (!entry) throw new Error(`Unknown quiz: ${quizId}`)
  const [quiz, answerKey] = await Promise.all([entry.loadQuestions(), entry.loadAnswers()])
  return withAnswers(quiz, answerKey)
}
