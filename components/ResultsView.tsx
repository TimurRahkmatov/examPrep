"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LayoutGrid, RotateCcw } from "lucide-react";
import { scopeStats } from "@/lib/mistakes";
import { useProgress } from "@/lib/progress-store";
import { getQuestionStatus, matchesFilter } from "@/lib/scoring";
import { getTestConfig, getTestQuestions, startTest, useMistakes, type TestConfig } from "@/lib/tests";
import type { ReviewFilter } from "@/lib/types";
import { AnswerReview } from "./AnswerReview";
import { Button, LinkButton } from "./Button";
import { FilterTabs } from "./FilterTabs";
import { MistakesCallout } from "./MistakesCallout";
import { QuestionNavigator } from "./QuestionNavigator";
import { ResultSummary } from "./ResultSummary";

export function ResultsView({ kind, scope }: { kind: TestConfig["kind"]; scope: string }) {
  const config = useMemo(() => getTestConfig(kind, scope)!, [kind, scope]);
  const router = useRouter();
  const progress = useProgress();
  const mistakes = useMistakes();
  const result = progress?.[config.progressKey]?.lastResult;
  const [filter, setFilter] = useState<ReviewFilter>("all");

  // Practice reviews come from the keys frozen at start, not the (now smaller) live mistake list.
  const { questions, items } = useMemo(
    () => getTestQuestions(config, result?.questionKeys, mistakes),
    [config, result?.questionKeys, mistakes],
  );

  const statuses = useMemo(
    () => questions.map((q) => getQuestionStatus(q, result?.answers ?? {}, true)),
    [questions, result],
  );

  const counts = useMemo(() => {
    const tally: Record<ReviewFilter, number> = { all: statuses.length, correct: 0, incorrect: 0, unanswered: 0 };
    for (const status of statuses) if (status !== "answered") tally[status]++;
    return tally;
  }, [statuses]);

  const start = (test: TestConfig) => {
    if (startTest(test)) router.push(test.testPath);
  };

  const jumpTo = (index: number) => {
    setFilter("all");
    // Wait for the full list to render before scrolling.
    requestAnimationFrame(() =>
      document.getElementById(`review-${index + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  if (progress === null || mistakes === null) {
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
        <h1 className="mt-4 text-2xl font-bold">Hozircha natijalar yo‘q</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Natija va tahlilni ko‘rish uchun «{config.title}» testini yakunlang.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <LinkButton href={config.testPath}>Testga o‘tish</LinkButton>
          <LinkButton href="/" variant="secondary">
            Fanlarga qaytish
          </LinkButton>
        </div>
      </main>
    );
  }

  const isPractice = kind === "practice";
  const practiceConfig = isPractice ? config : getTestConfig("practice", scope)!;
  const stats = scopeStats(mistakes, scope);
  // The retake button stays primary unless the mistakes card offers the main action.
  const practiceOffered = !isPractice && result.correct !== result.total && stats.pending > 0;

  const visible = questions
    .map((question, index) => ({ question, index, status: statuses[index] }))
    .filter((item) => matchesFilter(item.status, filter));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <ResultSummary
        subjectName={config.title}
        result={result}
        title={isPractice ? "Xatolar mashqi yakunlandi" : undefined}
      />

      <MistakesCallout
        kind={kind}
        result={result}
        stats={stats}
        allSubjects={scope === "all"}
        onPractice={() => start(practiceConfig)}
      />

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        {!isPractice && (
          <Button variant={practiceOffered ? "secondary" : "primary"} onClick={() => start(config)}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Testni qayta topshirish
          </Button>
        )}
        <LinkButton href="/" variant="secondary">
          <LayoutGrid className="h-4 w-4" aria-hidden /> Fanlarga qaytish
        </LinkButton>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Savollar xaritasi</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Savolga o‘tish uchun raqamni bosing.</p>
        <QuestionNavigator statuses={statuses} onSelect={jumpTo} legend={["correct", "incorrect", "unanswered"]} />
      </section>

      <section className="mt-10" aria-labelledby="review-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="review-heading" className="text-xl font-bold">
            Javoblar tahlili
          </h2>
          <FilterTabs value={filter} counts={counts} onChange={setFilter} />
        </div>
        <div className="mt-5 space-y-4">
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Bu toifada savollar yo‘q.
            </p>
          ) : (
            visible.map(({ question, index, status }) => {
              const item = items?.[index];
              return (
                <AnswerReview
                  key={question.id}
                  number={index + 1}
                  question={question}
                  selected={result.answers[question.id]}
                  status={status}
                  source={item && `${item.subject.name} · ${item.question.id}-savol`}
                />
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
