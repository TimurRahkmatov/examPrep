import { CheckCircle2, CircleDashed, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Question, QuestionStatus } from "@/lib/types";

interface AnswerReviewProps {
  number: number;
  question: Question;
  selected: string | undefined;
  status: QuestionStatus;
}

const borders: Record<QuestionStatus, string> = {
  correct: "border-l-emerald-500",
  incorrect: "border-l-rose-500",
  unanswered: "border-l-slate-300 dark:border-l-slate-600",
  answered: "border-l-indigo-500",
};

function AnswerLine({ tone, label, text }: { tone: "correct" | "wrong"; label: string; text: string }) {
  const Icon = tone === "correct" ? CheckCircle2 : XCircle;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        tone === "correct"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
          : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone === "correct" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")} aria-hidden />
      <p className="min-w-0 break-words text-sm sm:text-[15px]">
        <span className="font-semibold">{label}:</span> {text}
      </p>
    </div>
  );
}

export function AnswerReview({ number, question, selected, status }: AnswerReviewProps) {
  return (
    <article
      id={`review-${number}`}
      className={cn("scroll-mt-24 rounded-2xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6", borders[status])}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{number}-savol</p>
        {status === "correct" && <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">To‘g‘ri</span>}
        {status === "incorrect" && <span className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">Noto‘g‘ri</span>}
        {status === "unanswered" && <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Javobsiz</span>}
      </div>
      <h3 className="mt-2 break-words font-semibold leading-relaxed">{question.question}</h3>
      <div className="mt-4 space-y-2">
        {status === "unanswered" ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
            <CircleDashed className="h-5 w-5 shrink-0" aria-hidden />
            <span className="font-semibold">Javob berilmagan</span>
          </div>
        ) : (
          <AnswerLine tone={status === "correct" ? "correct" : "wrong"} label="Sizning javobingiz" text={selected ?? ""} />
        )}
        {status !== "correct" && <AnswerLine tone="correct" label="To‘g‘ri javob" text={question.correctAnswer} />}
      </div>
    </article>
  );
}
