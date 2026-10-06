export interface Question {
  id: number;
  question: string;
  options: string[];
  /** Must match one of `options` exactly. */
  correctAnswer: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

/** Selected option text, keyed by question id. */
export type AnswerMap = Record<number, string>;

export interface ActiveAttempt {
  answers: AnswerMap;
  currentIndex: number;
  /** Seeds the option shuffle so the order stays stable for this attempt. */
  seed: number;
  startedAt: number;
}

export interface TestResult {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percentage: number;
}

export interface CompletedAttempt extends TestResult {
  answers: AnswerMap;
  finishedAt: number;
}

export interface SubjectProgress {
  active?: ActiveAttempt;
  lastResult?: CompletedAttempt;
  bestPercentage?: number;
  completedCount: number;
}

export type ProgressState = Record<string, SubjectProgress>;

export type QuestionStatus = "unanswered" | "answered" | "correct" | "incorrect";

export type ReviewFilter = "all" | "correct" | "incorrect" | "unanswered";
