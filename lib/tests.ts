"use client";

import { getSubject, subjects } from "@/questions";
import { createLocalStore } from "./local-store";
import { applyPracticeResults, parseMistakeKey, pendingKeys, recordTestMistakes, type PracticeItem } from "./mistakes";
import { discardActiveAttempts, finishAttempt, startAttempt } from "./progress-store";
import type { MistakesState, PracticeScope, Question } from "./types";

const mistakesStore = createLocalStore<MistakesState>("examprep:mistakes:v1", () => ({ items: {}, mastered: {} }));

/** The mistake list, or null during server render and hydration. */
export const useMistakes = mistakesStore.useValue;

/** One test-taking flow: a normal subject test or a mistake practice. Both share the same runner and results page. */
export interface TestConfig {
  kind: "subject" | "practice";
  /** Subject id, or the practice scope ("all" or a subject id). */
  scope: string;
  progressKey: string;
  title: string;
  testPath: string;
  resultsPath: string;
}

export const practiceScopes: PracticeScope[] = ["all", ...subjects.map((s) => s.id)];

export function getTestConfig(kind: TestConfig["kind"], scope: string): TestConfig | undefined {
  if (kind === "subject") {
    const subject = getSubject(scope);
    if (!subject) return undefined;
    return {
      kind,
      scope,
      progressKey: subject.id,
      title: subject.name,
      testPath: `/subject/${scope}`,
      resultsPath: `/results/${scope}`,
    };
  }
  if (!practiceScopes.includes(scope)) return undefined;
  return {
    kind,
    scope,
    progressKey: `practice:${scope}`,
    title: scope === "all" ? "Barcha xatolar mashqi" : `Xatolar mashqi: ${getSubject(scope)!.name}`,
    testPath: `/practice/${scope}`,
    resultsPath: `/practice/${scope}/results`,
  };
}

function resolveItem(key: string, mistakes: MistakesState | null): PracticeItem | null {
  const { subjectId, questionId } = parseMistakeKey(key);
  const subject = getSubject(subjectId);
  const question = subject?.questions.find((q) => q.id === questionId);
  if (subject && question) return { key, subject, question };
  // The question was removed from the bank: fall back to the copy saved with the mistake.
  const saved = mistakes?.items[key];
  if (!saved) return null;
  return {
    key,
    subject: { id: saved.subjectId, name: saved.subjectName },
    question: { id: saved.questionId, question: saved.question, options: saved.options, correctAnswer: saved.correctAnswer },
  };
}

export interface TestQuestions {
  questions: Question[];
  /** Practice only: the source of each question, aligned with `questions`. */
  items: PracticeItem[] | null;
}

/**
 * The questions of a test. Practice questions get positional ids (1..n), because
 * ids repeat across subjects and the runner keys answers and shuffling by id.
 */
export function getTestQuestions(
  config: TestConfig,
  questionKeys: string[] | undefined,
  mistakes: MistakesState | null,
): TestQuestions {
  if (config.kind === "subject") return { questions: getSubject(config.scope)!.questions, items: null };
  const items = (questionKeys ?? []).map((key) => resolveItem(key, mistakes)).filter((item) => item !== null);
  return { questions: items.map((item, i) => ({ ...item.question, id: i + 1 })), items };
}

export function practiceKeys(scope: PracticeScope): string[] {
  return pendingKeys(mistakesStore.read(), scope, subjects.map((s) => s.id));
}

/** Starts a fresh attempt. A practice is built from the current mistakes; returns false when there are none. */
export function startTest(config: TestConfig): boolean {
  if (config.kind === "subject") {
    startAttempt(config.progressKey);
    return true;
  }
  const keys = practiceKeys(config.scope);
  if (keys.length === 0) return false;
  // One practice at a time: a paused practice in another scope could otherwise
  // bring back questions that this one is about to master.
  discardActiveAttempts("practice:", config.progressKey);
  startAttempt(config.progressKey, keys);
  return true;
}

/** Scores the attempt, then updates the mistake list from its answers. */
export function finishTest(config: TestConfig, { questions, items }: TestQuestions) {
  const attempt = finishAttempt(config.progressKey, questions);
  if (!attempt) return;
  const mistakes = mistakesStore.read();
  if (config.kind === "subject") {
    mistakesStore.write(recordTestMistakes(mistakes, getSubject(config.scope)!, questions, attempt.answers));
  } else if (items) {
    mistakesStore.write(applyPracticeResults(mistakes, items, (i) => attempt.answers[questions[i].id]));
  }
}
