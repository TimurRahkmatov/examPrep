import type { AnswerMap, Question, QuestionStatus, ReviewFilter, TestResult } from "./types";

export function getQuestionStatus(
  question: Question,
  answers: AnswerMap,
  submitted: boolean,
): QuestionStatus {
  const selected = answers[question.id];
  if (selected === undefined) return "unanswered";
  if (!submitted) return "answered";
  return selected === question.correctAnswer ? "correct" : "incorrect";
}

export function countAnswered(questions: Question[], answers: AnswerMap): number {
  return questions.filter((q) => answers[q.id] !== undefined).length;
}

export function computeResult(questions: Question[], answers: AnswerMap): TestResult {
  let correct = 0;
  let incorrect = 0;
  for (const question of questions) {
    const status = getQuestionStatus(question, answers, true);
    if (status === "correct") correct++;
    else if (status === "incorrect") incorrect++;
  }
  const total = questions.length;
  return {
    correct,
    incorrect,
    unanswered: total - correct - incorrect,
    total,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
  };
}

export function matchesFilter(status: QuestionStatus, filter: ReviewFilter): boolean {
  return filter === "all" || status === filter;
}
