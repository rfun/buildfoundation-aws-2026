import { describe, it, expect } from 'vitest'
import { loadScorableQuiz, quizzes, withAnswers } from '../data/quizzes/index.js'
import { BLANK, CORRECT, WRONG, gradeQuestion, isCorrect, scoreParticipant } from './scoring.js'

const quiz = await loadScorableQuiz('week4')
const byId = (id) => quiz.questions.find((q) => q.id === id)

/** The full correct answer key, as a per-question-id answer map. */
const allCorrect = Object.fromEntries(quiz.questions.map((q) => [q.id, q.correct]))

describe('week4 quiz data', () => {
  it('has 13 questions: 9 single, 4 multi', () => {
    expect(quiz.questions).toHaveLength(13)
    expect(quiz.questions.filter((q) => q.type === 'single')).toHaveLength(9)
    expect(quiz.questions.filter((q) => q.type === 'multi')).toHaveLength(4)
  })

  it('conforms to the §5 schema', () => {
    expect(quiz.id).toBe('week4')
    expect(quiz.title).toBe('AWS Core Concepts')
    expect(quiz.subtitle).toBeTruthy()
    expect(quiz.defaults.timeToRespondSeconds).toBe(45)
    for (const q of quiz.questions) {
      expect(typeof q.prompt).toBe('string')
      expect(q.options.length).toBeGreaterThanOrEqual(4)
      expect(q.selections).toBe(q.type === 'multi' ? 2 : 1)
      expect(q.correct).toHaveLength(q.selections)
      for (const i of q.correct) {
        expect(i).toBeGreaterThanOrEqual(0)
        expect(i).toBeLessThan(q.options.length)
      }
    }
  })

  it('ships no answers in the questions file', async () => {
    const questionsOnly = await quizzes.week4.loadQuestions()
    for (const q of questionsOnly.questions) {
      expect(q).not.toHaveProperty('correct')
    }
  })

  it('exposes the answer key as a standalone, independently importable module', async () => {
    const key = await quizzes.week4.loadAnswers()
    expect(key.quizId).toBe('week4')
    expect(Object.keys(key.answers)).toHaveLength(13)
    expect(key.answers['10']).toEqual([0, 4])
  })

  it('withAnswers leaves the questions file untouched', async () => {
    const questionsOnly = await quizzes.week4.loadQuestions()
    const merged = withAnswers(questionsOnly, await quizzes.week4.loadAnswers())
    expect(merged.questions[0].correct).toEqual([3])
    expect(questionsOnly.questions[0]).not.toHaveProperty('correct')
  })
})

describe('isCorrect — every Week 4 question', () => {
  it.each(quiz.questions.map((q) => [q.id, q]))('Q%i marks its own key correct', (_id, q) => {
    expect(isCorrect(q, q.correct)).toBe(true)
  })

  it.each(quiz.questions.map((q) => [q.id, q]))('Q%i marks every wrong pick wrong', (_id, q) => {
    const correct = new Set(q.correct)
    for (let i = 0; i < q.options.length; i += 1) {
      if (correct.has(i)) continue
      // A distractor swapped in for the first correct option is never right.
      const spoiled = [i, ...q.correct.slice(1)]
      expect(isCorrect(q, spoiled)).toBe(false)
    }
  })

  it('ignores selection order and duplicate picks', () => {
    const q = byId(11) // correct: [1, 2]
    expect(isCorrect(q, [2, 1])).toBe(true)
    expect(isCorrect(q, [1, 2, 2])).toBe(true)
    expect(isCorrect(q, [1, 1])).toBe(false)
  })

  it('accepts numeric-string indices off the wire', () => {
    expect(isCorrect(byId(2), ['1'])).toBe(true)
  })
})

describe('multi-select is all-or-nothing', () => {
  const multi = quiz.questions.filter((q) => q.type === 'multi')

  it.each(multi.map((q) => [q.id, q]))('Q%i: one of two correct scores WRONG', (_id, q) => {
    expect(isCorrect(q, [q.correct[0]])).toBe(false)
    expect(isCorrect(q, [q.correct[1]])).toBe(false)
    expect(gradeQuestion(q, [q.correct[0]])).toBe(WRONG)
  })

  it.each(multi.map((q) => [q.id, q]))('Q%i: one right + one wrong scores WRONG', (_id, q) => {
    const distractor = q.options.findIndex((_, i) => !q.correct.includes(i))
    expect(isCorrect(q, [q.correct[0], distractor])).toBe(false)
  })

  it('over-selecting a superset of the correct answers is wrong', () => {
    const q = byId(10) // correct: [0, 4]
    expect(isCorrect(q, [0, 4, 1])).toBe(false)
  })
})

describe('gradeQuestion', () => {
  const q = byId(1) // single, correct: [3]

  it('grades a right answer correct', () => {
    expect(gradeQuestion(q, [3])).toBe(CORRECT)
  })

  it('grades a wrong answer wrong', () => {
    expect(gradeQuestion(q, [0])).toBe(WRONG)
  })

  it.each([[undefined], [null], [[]]])('grades a missing answer (%j) BLANK, not wrong', (selected) => {
    expect(gradeQuestion(q, selected)).toBe(BLANK)
    expect(isCorrect(q, selected)).toBe(false)
  })
})

describe('scoreParticipant', () => {
  it('scores a perfect run 13/13', () => {
    const score = scoreParticipant(quiz, allCorrect)
    expect(score).toMatchObject({ quizId: 'week4', total: 13, correct: 13, wrong: 0, blank: 0, percent: 100 })
    expect(score.results.every((r) => r.status === CORRECT)).toBe(true)
  })

  it('scores an all-wrong run 0/13 with nothing blank', () => {
    const wrong = Object.fromEntries(
      quiz.questions.map((q) => {
        const distractors = q.options.map((_, i) => i).filter((i) => !q.correct.includes(i))
        return [q.id, distractors.slice(0, q.selections)]
      }),
    )
    const score = scoreParticipant(quiz, wrong)
    expect(score).toMatchObject({ correct: 0, wrong: 13, blank: 0, percent: 0 })
  })

  it('counts an unanswered question as blank, not wrong', () => {
    const answers = { ...allCorrect }
    delete answers[7]
    const score = scoreParticipant(quiz, answers)
    expect(score).toMatchObject({ correct: 12, wrong: 0, blank: 1 })
    expect(score.results.find((r) => r.id === 7)).toMatchObject({ status: BLANK, selected: null })
  })

  it('scores a late joiner (Q1–Q6 blank) only on what they answered', () => {
    const answers = Object.fromEntries(
      quiz.questions.filter((q) => q.id >= 7).map((q) => [q.id, q.correct]),
    )
    const score = scoreParticipant(quiz, answers)
    expect(score).toMatchObject({ total: 13, correct: 7, wrong: 0, blank: 6 })
    expect(score.results.slice(0, 6).every((r) => r.status === BLANK)).toBe(true)
  })

  it('scores a participant who answered nothing at all', () => {
    const score = scoreParticipant(quiz, {})
    expect(score).toMatchObject({ correct: 0, wrong: 0, blank: 13, percent: 0 })
  })

  it('accepts answers as an array indexed by qIndex (the wire format)', () => {
    const answers = quiz.questions.map((q) => q.correct)
    answers[3] = [] // Q4 unanswered
    const score = scoreParticipant(quiz, answers)
    expect(score).toMatchObject({ correct: 12, wrong: 0, blank: 1 })
    expect(score.results[3].status).toBe(BLANK)
  })

  it('reports selected and correct per question, normalized and sorted', () => {
    const score = scoreParticipant(quiz, { 11: [2, 1] })
    const q11 = score.results.find((r) => r.id === 11)
    expect(q11).toMatchObject({ index: 10, status: CORRECT, selected: [1, 2], correct: [1, 2] })
  })

  it('mixes correct, wrong and blank into one tally', () => {
    // Q1 right, Q10 half-right (wrong), Q13 unanswered, rest right.
    const answers = { ...allCorrect, 10: [0] }
    delete answers[13]
    const score = scoreParticipant(quiz, answers)
    expect(score).toMatchObject({ correct: 11, wrong: 1, blank: 1 })
    expect(score.percent).toBe(85)
  })
})
