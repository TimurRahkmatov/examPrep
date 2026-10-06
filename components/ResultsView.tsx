"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LayoutGrid, RotateCcw } from "lucide-react";
import { getSubject } from "@/questions";
import { startAttempt, useProgress } from "@/lib/progress-store";
import { getQuestionStatus, matchesFilter } from "@/lib/scoring";
import type { ReviewFilter } from "@/lib/types";
import { AnswerReview } from "./AnswerReview";
import { Button, LinkButton } from "./Button";
import { FilterTabs } from "./FilterTabs";
import { QuestionNavigator } from "./QuestionNavigator";
import { ResultSummary } from "./ResultSummary";

export function ResultsView({ subjectId }: { subjectId: string }) {
  const subject = getSubject(subjectId)!;
  const router = useRouter();
  const progress = useProgress();
  const result = progress?.[subjectId]?.lastResult;
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const statuses = useMemo(
    () => subject.questions.map((q) => getQuestionStatus(q, result?.answers ?? {}, true)),
    [subject, result],
  );

  const counts = useMemo(() => {
    const tally: Record<ReviewFilter, number> = { all: statuses.length, correct: 0, incorrect: 0, unanswered: 0 };
    for (const status of statuses) if (status !== "answered") tally[status]++;
    return tally;
  }, [statuses]);

  const retake = () => {
    startAttempt(subjectId);
    router.push(`/subject/${subjectId}`);
  };

  const jumpTo = (index: number) => {
    setFilter("all");
    // Wait for the full list to render before scrolling.
    requestAnimationFrame(() =>
      document.getElementById(`review-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  if (progress === null) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </main>
    );
  }

  if (!result) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <ClipboardList className="mx-auto h-12 w-12 text-slate-400" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">No results yet</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Finish a {subject.name} test to see your score and review.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <LinkButton href={`/subject/${subjectId}`}>Go to Test</LinkButton>
          <LinkButton href="/" variant="secondary">
            Back to Subjects
          </LinkButton>
        </div>
      </main>
    );
  }

  const visible = subject.questions
    .map((question, index) => ({ question, index, status: statuses[index] }))
    .filter((item) => matchesFilter(item.status, filter));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <ResultSummary subjectName={subject.name} result={result} />

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button onClick={retake}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Retake Test
        </Button>
        <LinkButton href="/" variant="secondary">
          <LayoutGrid className="h-4 w-4" aria-hidden /> Back to Subjects
        </LinkButton>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Question map</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Tap a number to jump to that question.</p>
        <QuestionNavigator statuses={statuses} onSelect={jumpTo} legend={["correct", "incorrect", "unanswered"]} />
      </section>

      <section className="mt-10" aria-labelledby="review-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="review-heading" className="text-xl font-bold">
            Answer review
          </h2>
          <FilterTabs value={filter} counts={counts} onChange={setFilter} />
        </div>
        <div className="mt-5 space-y-4">
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No questions in this category.
            </p>
          ) : (
            visible.map(({ question, index, status }) => (
              <AnswerReview
                key={question.id}
                number={index + 1}
                question={question}
                selected={result.answers[question.id]}
                status={status}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
