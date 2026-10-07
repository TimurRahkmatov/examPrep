import type { Subject } from "@/lib/types";
import { questions as subject1 } from "./subject1";
import { questions as subject2 } from "./subject2";
import { questions as subject5 } from "./subject5";
import { questions as subject4 } from "./subject4";

// Edit names and descriptions here. The question count comes from each file.
export const subjects: Subject[] = [
  {
    id: "subject1",
    name: "Profayling",
    description: "Profayling, verbal va noverbal muloqot, etika",
    questions: subject1,
  },
  {
    id: "subject2",
    name: "Oila psixologiyasi",
    description: "Oila psixologiyasi (5-kurs, PP sirtqi)",
    questions: subject2,
  },
  {
    id: "subject5",
    name: "Proyektiv psixologiya",
    description: "Proyektiv psixologiya (150 ta test)",
    questions: subject5,
  },
  {
    id: "subject4",
    name: "Xulq testlari",
    description: "Xulq psixologiyasi bo‘yicha testlar bazasi",
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
