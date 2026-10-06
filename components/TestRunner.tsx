"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag } from "lucide-react";
import { getSubject } from "@/questions";
import { finishAttempt, goToQuestion, selectAnswer, startAttempt, useProgress } from "@/lib/progress-store";
import { countAnswered, getQuestionStatus } from "@/lib/scoring";
import { shuffleOptions } from "@/lib/shuffle";
import { Button, LinkButton } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { ProgressBar } from "./ProgressBar";
import { QuestionCard } from "./QuestionCard";
import { QuestionNavigator } from "./QuestionNavigator";

export function TestRunner({ subjectId }: { subjectId: string }) {
  const subject = getSubject(subjectId)!;
  const { questions } = subject;
  const router = useRouter();
  const progress = useProgress();
  const active = progress?.[subjectId]?.active;
  const completed = Boolean(progress?.[subjectId]?.lastResult);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Opening a subject that was never started begins a new attempt right away.
  useEffect(() => {
    if (progress && !active && !completed) startAttempt(subjectId);
  }, [progress, active, completed, subjectId]);

  const total = questions.length;
  const index = active ? Math.min(Math.max(active.currentIndex, 0), total - 1) : 0;
  const question = questions[index];
  const answers = useMemo(() => active?.answers ?? {}, [active]);
  const options = useMemo(() => (active ? shuffleOptions(question, active.seed) : []), [question, active]);
  const answeredCount = countAnswered(questions, answers);
  const unanswered = total - answeredCount;
  const statuses = useMemo(() => questions.map((q) => getQuestionStatus(q, answers, false)), [questions, answers]);
  const isLast = index === total - 1;

  const goTo = useCallback(
    (next: number) => {
      goToQuestion(subjectId, Math.min(Math.max(next, 0), total - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [subjectId, total],
  );

  const submit = () => {
    finishAttempt(subjectId, questions);
    router.push(`/results/${subjectId}`);
  };

  const requestFinish = () => {
    if (unanswered > 0) setConfirmOpen(true);
    else submit();
  };

  const closeConfirm = useCallback(() => setConfirmOpen(false), []);

  if (progress && !active && completed) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Siz «{subject.name}» testini yakunladingiz</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Javoblaringizni ko‘rib chiqing yoki testni qaytadan boshlang.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <LinkButton href={`/results/${subjectId}`}>Natijalarni ko‘rish</LinkButton>
          <Button variant="secondary" onClick={() => startAttempt(subjectId)}>
            Testni qayta topshirish
          </Button>
        </div>
      </main>
    );
  }

  if (!active) {
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
              <h1 className="truncate font-semibold">{subject.name}</h1>
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
            onSelect={(option) => selectAnswer(subjectId, question.id, option)}
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
