"use client";

import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, Play, RotateCcw, Trophy } from "lucide-react";
import { startAttempt } from "@/lib/progress-store";
import { countAnswered } from "@/lib/scoring";
import type { Subject, SubjectProgress } from "@/lib/types";
import { Button, LinkButton } from "./Button";
import { ProgressBar } from "./ProgressBar";

interface SubjectCardProps {
  subject: Subject;
  index: number;
  progress: SubjectProgress | undefined;
}

const accents = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-indigo-500",
  "from-violet-500 to-fuchsia-500",
  "from-blue-600 to-cyan-500",
];

export function SubjectCard({ subject, index, progress }: SubjectCardProps) {
  const router = useRouter();
  const total = subject.questions.length;
  const active = progress?.active;
  const last = progress?.lastResult;
  const answered = active ? countAnswered(subject.questions, active.answers) : last ? total - last.unanswered : 0;
  const testPath = `/subject/${subject.id}`;

  const startFresh = () => {
    startAttempt(subject.id);
    router.push(testPath);
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start gap-4">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${accents[index % accents.length]} text-white shadow-sm`}
        >
          <BookOpen className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold">{subject.name}</h2>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{subject.description}</p>
        </div>
        {active ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
            Jarayonda
          </span>
        ) : last ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Yakunlangan
          </span>
        ) : null}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Savollar</dt>
          <dd className="mt-0.5 font-semibold">{total}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Oxirgi natija</dt>
          <dd className="mt-0.5 font-semibold">{last ? `${last.correct}/${last.total}` : "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Eng yaxshi</dt>
          <dd className="mt-0.5 inline-flex items-center gap-1 font-semibold">
            {progress?.bestPercentage !== undefined ? (
              <>
                <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden />
                {progress.bestPercentage}%
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Bajarildi</span>
          <span className="font-medium tabular-nums">
            {answered}/{total}
          </span>
        </div>
        <ProgressBar value={answered} max={total} label={`${subject.name}: bajarilish`} tone={!active && last ? "success" : "primary"} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {active ? (
          <>
            <LinkButton href={testPath} className="flex-1">
              <Play className="h-4 w-4" aria-hidden /> Testni davom ettirish
            </LinkButton>
            <Button variant="secondary" onClick={startFresh} aria-label={`${subject.name}: qayta boshlash`}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Qayta boshlash
            </Button>
          </>
        ) : (
          <>
            <Button onClick={startFresh} className="flex-1">
              <Play className="h-4 w-4" aria-hidden /> {last ? "Qayta topshirish" : "Testni boshlash"}
            </Button>
            {last && (
              <LinkButton variant="secondary" href={`/results/${subject.id}`}>
                Natijalarni ko‘rish
              </LinkButton>
            )}
          </>
        )}
      </div>
    </article>
  );
}
