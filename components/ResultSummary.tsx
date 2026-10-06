import { CheckCircle2, CircleDashed, Target, XCircle } from "lucide-react";
import type { TestResult } from "@/lib/types";
import { ResultCard } from "./ResultCard";
import { ResultCircle } from "./ResultCircle";

function headline(percentage: number) {
  if (percentage >= 90) return "Outstanding work!";
  if (percentage >= 70) return "Great job, well done.";
  if (percentage >= 40) return "Good effort. Review your mistakes below.";
  return "Keep practicing. Review your mistakes below.";
}

export function ResultSummary({ subjectName, result }: { subjectName: string; result: TestResult }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <ResultCircle percentage={result.percentage} />
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{subjectName}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Test Completed 🎉</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{headline(result.percentage)}</p>
          <p className="mt-4 text-4xl font-bold tabular-nums">
            {result.correct}
            <span className="text-2xl text-slate-400 dark:text-slate-500"> / {result.total}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <ResultCard label="Score" value={result.percentage} suffix="%" icon={Target} tone="primary" />
        <ResultCard label="Correct answers" value={result.correct} icon={CheckCircle2} tone="success" />
        <ResultCard label="Incorrect answers" value={result.incorrect} icon={XCircle} tone="error" />
        <ResultCard label="Unanswered" value={result.unanswered} icon={CircleDashed} tone="neutral" />
      </div>
    </section>
  );
}
