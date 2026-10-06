"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, PartyPopper } from "lucide-react";
import { goToQuestion, selectAnswer, useProgress } from "@/lib/progress-store";
import { countAnswered, getQuestionStatus } from "@/lib/scoring";
import { shuffleOptions } from "@/lib/shuffle";
import { finishTest, getTestConfig, getTestQuestions, startTest, useMistakes, type TestConfig } from "@/lib/tests";
import { scopeStats } from "@/lib/mistakes";
import { Button, LinkButton } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { QuestionNavigator } from "./QuestionNavigator";

export function TestRunner({ kind, scope }: { kind: TestConfig["kind"]; scope: string }) {
  const config = useMemo(() => getTestConfig(kind, scope)!, [kind, scope]);
  const key = config.progressKey;
  const isPractice = kind === "practice";
  const router = useRouter();
  const progress = useProgress();
  const mistakes = useMistakes();
  const active = progress?.[key]?.active;
  const completed = Boolean(progress?.[key]?.lastResult);
  const pendingMistakes = mistakes ? scopeStats(mistakes, scope).pending : 0;
  const ready = progress !== null && mistakes !== null;
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Opening a test that was never started begins a new attempt right away.
  // A practice with no mistakes to practice doesn't start; the empty state shows instead.
  useEffect(() => {
    if (ready && !active && !completed) startTest(config);
  }, [ready, active, completed, config]);

  const test = useMemo(() => getTestQuestions(config, active?.questionKeys, mistakes), [config, active?.questionKeys, mistakes]);
  const { questions, items } = test;
  const total = questions.length;
  const index = active ? Math.min(Math.max(active.currentIndex, 0), Math.max(total - 1, 0)) : 0;
  const question = questions[index];
  const answers = useMemo(() => active?.answers ?? {}, [active]);
  const options = useMemo(() => (active && question ? shuffleOptions(question, active.seed) : []), [question, active]);
  const answeredCount = countAnswered(questions, answers);
  const unanswered = total - answeredCount;
  const statuses = useMemo(() => questions.map((q) => getQuestionStatus(q, answers, false)), [questions, answers]);
  const isLast = index === total - 1;
  const item = items?.[index];

  const goTo = useCallback(
    (next: number) => {
      goToQuestion(key, Math.min(Math.max(next, 0), total - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [key, total],
  );

  const submit = () => {
    finishTest(config, test);
    router.push(config.resultsPath);
  };

  const requestFinish = () => {
    if (unanswered > 0) setConfirmOpen(true);
    else submit();
  };

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  if (ready && !active && completed) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Siz «{config.title}» testini yakunladingiz</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Javoblaringizni ko‘rib chiqing yoki testni qaytadan boshlang.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <LinkButton href={config.resultsPath}>Natijalarni ko‘rish</LinkButton>
          {(!isPractice || pendingMistakes > 0) && (
            <Button variant="secondary" onClick={() => startTest(config)}>
              {isPractice ? `Qolgan xatolarni mashq qilish (${pendingMistakes})` : "Testni qayta topshirish"}
            </Button>
          )}
        </div>
      </main>
    );
  }

  if (ready && isPractice && (active ? total === 0 : pendingMistakes === 0)) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <PartyPopper className="mx-auto h-12 w-12 text-emerald-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Mashq qilish uchun xatolar yo‘q 🎉</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Testlarda noto‘g‘ri javob bergan savollaringiz shu yerda mashq uchun to‘planadi.</p>
        <LinkButton href="/" className="mt-6">
          Fanlarga qaytish
        </LinkButton>
      </main>
    );
  }

  if (!active || !question) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      </main>
    );
  }

  const legend = ["unanswered", "answered"] as const;

  return (
    <>
      <div className="sticky top-16 z-20 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href="/"
                aria-label="Fanlarga qaytish"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </Link>
              <h1 className="truncate font-semibold">{config.title}</h1>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-slate-600 dark:text-slate-300">
              Savol {index + 1} / {total}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={index + 1} max={total} label="Testdagi o‘rin" />
            <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
              {Math.round(((index + 1) / total) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-8">
        <div className="min-w-0">
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <QuestionNavigator statuses={statuses} currentIndex={index} onSelect={goTo} layout="strip" legend={[...legend]} />
          </div>

          <QuestionCard
            key={question.id}
            number={index + 1}
            question={question}
            options={options}
            selected={answers[question.id]}
            source={item && `${item.subject.name} · ${item.question.id}-savol`}
            onSelect={(option) => selectAnswer(key, question.id, option)}
          />

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => goTo(index - 1)} disabled={index === 0}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Oldingi
            </Button>
            {isLast ? (
              <Button onClick={requestFinish}>
                <Flag className="h-4 w-4" aria-hidden /> Testni yakunlash
              </Button>
            ) : (
              <Button onClick={() => goTo(index + 1)}>
                Keyingi <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-44 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Savollar</h2>
              <span className="text-sm tabular-nums text-slate-500 dark:text-slate-400">
                {answeredCount}/{total} ta javob berildi
              </span>
            </div>
            <div className="mt-4 max-h-[50vh] overflow-y-auto pr-1">
              <QuestionNavigator statuses={statuses} currentIndex={index} onSelect={goTo} legend={[...legend]} />
            </div>
            <Button variant="secondary" onClick={requestFinish} className="mt-5 w-full">
              <Flag className="h-4 w-4" aria-hidden /> Testni yakunlash
            </Button>
          </div>
        </aside>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 lg:hidden">
          {answeredCount}/{total} ta javob berildi ·{" "}
          <button type="button" onClick={requestFinish} className="font-medium text-indigo-600 underline-offset-4 hover:underline dark:text-indigo-400">
            Testni muddatidan oldin yakunlash
          </button>
        </p>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Testni yakunlaysizmi?"
        message={`Sizda ${unanswered} ta javob berilmagan savol bor. Haqiqatan ham testni yakunlamoqchimisiz?`}
        cancelLabel="Testni davom ettirish"
        confirmLabel="Baribir yakunlash"
        onCancel={closeConfirm}
        onConfirm={submit}
      />
    </>
  );
}
