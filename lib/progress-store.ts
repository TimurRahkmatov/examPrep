"use client";

import { createLocalStore } from "./local-store";
import { computeResult } from "./scoring";
import { newSeed } from "./shuffle";
import type { CompletedAttempt, ProgressState, Question, SubjectProgress } from "./types";

// Keyed by subject id for normal tests and by `practice:<scope>` for mistake practice.
const store = createLocalStore<ProgressState>("examprep:progress:v1", () => ({}));

/** Saved progress for all tests, or null during server render and hydration. */
export const useProgress = store.useValue;

function updateSubject(key: string, update: (current: SubjectProgress) => SubjectProgress) {
  const state = store.read();
  store.write({ ...state, [key]: update(state[key] ?? { completedCount: 0 }) });
}

export function startAttempt(key: string, questionKeys?: string[]) {
  updateSubject(key, (current) => ({
    ...current,
    active: { answers: {}, currentIndex: 0, seed: newSeed(), startedAt: Date.now(), questionKeys },
  }));
}

export function selectAnswer(key: string, questionId: number, option: string) {
  updateSubject(key, (current) =>
    current.active
      ? { ...current, active: { ...current.active, answers: { ...current.active.answers, [questionId]: option } } }
      : current,
  );
}

export function goToQuestion(key: string, index: number) {
  updateSubject(key, (current) =>
    current.active ? { ...current, active: { ...current.active, currentIndex: index } } : current,
  );
}

/** Drops unfinished attempts whose key starts with `prefix`, except `keep`. Finished results stay. */
export function discardActiveAttempts(prefix: string, keep: string) {
  const state = store.read();
  const stale = Object.keys(state).filter((key) => key.startsWith(prefix) && key !== keep && state[key].active);
  if (stale.length === 0) return;
  const next = { ...state };
  for (const key of stale) next[key] = { ...state[key], active: undefined };
  store.write(next);
}

/** Scores the active attempt, stores it as the last result and returns it. */
export function finishAttempt(key: string, questions: Question[]): CompletedAttempt | undefined {
  let finished: CompletedAttempt | undefined;
  updateSubject(key, (current) => {
    if (!current.active) return current;
    const { answers, questionKeys } = current.active;
    const result = computeResult(questions, answers);
    finished = { ...result, answers, questionKeys, finishedAt: Date.now() };
    return {
      completedCount: current.completedCount + 1,
      bestPercentage: Math.max(current.bestPercentage ?? 0, result.percentage),
      lastResult: finished,
    };
  });
  return finished;
}
