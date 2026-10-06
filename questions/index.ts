import type { Subject } from "@/lib/types";
import { questions as subject1 } from "./subject1";
import { questions as subject2 } from "./subject2";
import { questions as subject3 } from "./subject3";
import { questions as subject4 } from "./subject4";

// Edit names and descriptions here. The question count comes from each file.
export const subjects: Subject[] = [
  {
    id: "subject1",
    name: "Profayling",
    description: "Profiling, verbal and nonverbal communication, ethics",
    questions: subject1,
  },
  {
    id: "subject2",
    name: "Oila psixologiyasi",
    description: "Family psychology (5th year, PP extramural)",
    questions: subject2,
  },
  {
    id: "subject3",
    name: "Deviant xulq",
    description: "Deviant behaviour psychology",
    questions: subject3,
  },
  {
    id: "subject4",
    name: "Xulq testlari",
    description: "Behaviour psychology test bank",
    questions: subject4,
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id);
}

// Catches typos when editing question files: shows up in the dev server console.
if (process.env.NODE_ENV !== "production") {
  for (const subject of subjects) {
    const ids = new Set<number>();
    for (const q of subject.questions) {
      if (ids.has(q.id)) console.error(`[questions] ${subject.id}: duplicate id ${q.id}`);
      ids.add(q.id);
      if (!q.options.includes(q.correctAnswer)) {
        console.error(`[questions] ${subject.id} #${q.id}: correctAnswer is not one of the options`);
      }
      if (new Set(q.options).size !== q.options.length) {
        console.error(`[questions] ${subject.id} #${q.id}: options must be unique`);
      }
    }
  }
}
