import type { Question } from "@/lib/types";
import { AnswerOption } from "./AnswerOption";

interface QuestionCardProps {
  number: number;
  question: Question;
  options: string[];
  selected: string | undefined;
  onSelect: (option: string) => void;
  /** Practice only: where the question comes from, e.g. "Profayling · 25-savol". */
  source?: string;
}

const LETTERS = "ABCDEFGH";

export function QuestionCard({ number, question, options, selected, onSelect, source }: QuestionCardProps) {
  const headingId = `question-${question.id}`;
  return (
    <section className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        {number}-savol
        {source && <span className="font-medium text-slate-500 dark:text-slate-400">{source}</span>}
      </p>
      <h2 id={headingId} className="mt-2 break-words text-lg font-semibold leading-relaxed sm:text-xl">
        {question.question}
      </h2>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-6 space-y-3">
        {options.map((option, i) => (
          <AnswerOption
            key={option}
            letter={LETTERS[i] ?? String(i + 1)}
            text={option}
            selected={selected === option}
            onSelect={() => onSelect(option)}
          />
        ))}
      </div>
    </section>
  );
}
