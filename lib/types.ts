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
  /** Practice tests only: the mistake keys this attempt was built from, frozen at start. */
  questionKeys?: string[];
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
  questionKeys?: string[];
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

/** `${subjectId}:${questionId}` – question ids are only unique within a subject. */
export type MistakeKey = string;

export interface MistakeEntry {
  key: MistakeKey;
  subjectId: string;
  subjectName: string;
  questionId: number;
  question: string;
  options: string[];
  correctAnswer: string;
  /** The latest wrong answer the user picked. */
  selectedAnswer: string;
  timesWrong: number;
  addedAt: number;
  lastWrongAt: number;
}

export interface MistakesState {
  /** Questions still to practice. */
  items: Record<MistakeKey, MistakeEntry>;
  /** Former mistakes answered correctly in practice, with the time they were mastered. */
  mastered: Record<MistakeKey, number>;
}

/** "all" or a subject id. */
export type PracticeScope = string;
