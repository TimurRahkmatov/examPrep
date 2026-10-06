import { CheckCircle2, CircleDashed, Target, XCircle } from "lucide-react";
import type { TestResult } from "@/lib/types";
import { ResultCard } from "./ResultCard";
import { ResultCircle } from "./ResultCircle";

function headline(percentage: number) {
  if (percentage >= 90) return "Ajoyib natija!";
  if (percentage >= 70) return "Juda yaxshi, barakalla!";
  if (percentage >= 40) return "Yaxshi harakat. Quyida xatolaringizni ko‘rib chiqing.";
  return "Mashq qilishda davom eting. Quyida xatolaringizni ko‘rib chiqing.";
}

interface ResultSummaryProps {
  subjectName: string;
  result: TestResult;
  title?: string;
}

export function ResultSummary({ subjectName, result, title = "Test yakunlandi 🎉" }: ResultSummaryProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <ResultCircle percentage={result.percentage} />
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{subjectName}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{headline(result.percentage)}</p>
          <p className="mt-4 text-4xl font-bold tabular-nums">
            {result.correct}
            <span className="text-2xl text-slate-400 dark:text-slate-500"> / {result.total}</span>
          </p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <ResultCard label="Natija" value={result.percentage} suffix="%" icon={Target} tone="primary" />
        <ResultCard label="To‘g‘ri javoblar" value={result.correct} icon={CheckCircle2} tone="success" />
        <ResultCard label="Noto‘g‘ri javoblar" value={result.incorrect} icon={XCircle} tone="error" />
        <ResultCard label="Javobsiz" value={result.unanswered} icon={CircleDashed} tone="neutral" />
      </div>
    </section>
  );
}
