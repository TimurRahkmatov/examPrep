"use client";

import { subjects } from "@/questions";
import { useProgress } from "@/lib/progress-store";
import { SubjectCard } from "./SubjectCard";

export function Dashboard() {
  const progress = useProgress();

  const completed = subjects.filter((s) => progress?.[s.id]?.lastResult);
  const average =
    completed.length === 0
      ? null
      : Math.round(completed.reduce((sum, s) => sum + (progress?.[s.id]?.lastResult?.percentage ?? 0), 0) / completed.length);
  const inProgress = subjects.filter((s) => progress?.[s.id]?.active).length;

  const stats = [
    { label: "Fanlar", value: String(subjects.length) },
    { label: "Jarayonda", value: progress ? String(inProgress) : "–" },
    { label: "Yakunlangan", value: progress ? String(completed.length) : "–" },
    { label: "O‘rtacha ball", value: average === null ? "—" : `${average}%` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Bosh sahifa</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Keyingi testga tayyormisiz?</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Fanni tanlang va mashq qilishni boshlang.</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</dt>
              <dd className="mt-0.5 text-xl font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Fanlar" className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
        {progress === null
          ? subjects.map((s) => (
              <div key={s.id} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
            ))
          : subjects.map((subject, index) => (
              <SubjectCard key={subject.id} subject={subject} index={index} progress={progress[subject.id]} />
            ))}
      </section>
    </main>
  );
}
