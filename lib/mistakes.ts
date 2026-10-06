import type { AnswerMap, MistakeEntry, MistakeKey, MistakesState, PracticeScope, Question } from "./types";

export function mistakeKey(subjectId: string, questionId: number): MistakeKey {
  return `${subjectId}:${questionId}`;
}

export function parseMistakeKey(key: MistakeKey): { subjectId: string; questionId: number } {
  const split = key.lastIndexOf(":");
  return { subjectId: key.slice(0, split), questionId: Number(key.slice(split + 1)) };
}

export function inScope(key: MistakeKey, scope: PracticeScope): boolean {
  return scope === "all" || parseMistakeKey(key).subjectId === scope;
}

function without<T>(record: Record<string, T>, key: string): Record<string, T> {
  if (!(key in record)) return record;
  const copy = { ...record };
  delete copy[key];
  return copy;
}

function addMistake(
  state: MistakesState,
  subject: { id: string; name: string },
  question: Question,
  selectedAnswer: string,
  now: number,
): MistakesState {
  const key = mistakeKey(subject.id, question.id);
  const previous = state.items[key];
  const entry: MistakeEntry = {
    key,
    subjectId: subject.id,
    subjectName: subject.name,
    questionId: question.id,
    question: question.question,
    options: [...question.options],
    correctAnswer: question.correctAnswer,
    selectedAnswer,
    timesWrong: (previous?.timesWrong ?? 0) + 1,
    addedAt: previous?.addedAt ?? now,
    lastWrongAt: now,
  };
  // A mastered question answered wrong again goes back to the practice list.
  return { items: { ...state.items, [key]: entry }, mastered: without(state.mastered, key) };
}

/** After a normal test: every wrong answer joins the mistake list (once per question). */
export function recordTestMistakes(
  state: MistakesState,
  subject: { id: string; name: string },
  questions: Question[],
  answers: AnswerMap,
  now = Date.now(),
): MistakesState {
  let next = state;
  for (const question of questions) {
    const selected = answers[question.id];
    if (selected !== undefined && selected !== question.correctAnswer) {
      next = addMistake(next, subject, question, selected, now);
    }
  }
  return next;
}

export interface PracticeItem {
  key: MistakeKey;
  subject: { id: string; name: string };
  /** The original question, with its original id. */
  question: Question;
}

/**
 * After a practice test: correct answers are mastered and leave the list,
 * wrong answers stay (with the new answer), unanswered questions stay unchanged.
 */
export function applyPracticeResults(
  state: MistakesState,
  items: PracticeItem[],
  selectedByIndex: (index: number) => string | undefined,
  now = Date.now(),
): MistakesState {
  let next = state;
  items.forEach((item, index) => {
    const selected = selectedByIndex(index);
    if (selected === undefined) return;
    if (selected === item.question.correctAnswer) {
      next = { items: without(next.items, item.key), mastered: { ...next.mastered, [item.key]: now } };
    } else {
      next = addMistake(next, item.subject, item.question, selected, now);
    }
  });
  return next;
}

/** Pending mistake keys for a scope, in subject order then question order. */
export function pendingKeys(state: MistakesState, scope: PracticeScope, subjectOrder: string[]): MistakeKey[] {
  return Object.keys(state.items)
    .filter((key) => inScope(key, scope))
    .sort((a, b) => {
      const pa = parseMistakeKey(a);
      const pb = parseMistakeKey(b);
      return subjectOrder.indexOf(pa.subjectId) - subjectOrder.indexOf(pb.subjectId) || pa.questionId - pb.questionId;
    });
}

export function scopeStats(state: MistakesState, scope: PracticeScope) {
  const pending = Object.keys(state.items).filter((key) => inScope(key, scope)).length;
  const mastered = Object.keys(state.mastered).filter((key) => inScope(key, scope)).length;
  return { pending, mastered, total: pending + mastered };
}
