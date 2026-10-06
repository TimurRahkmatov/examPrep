"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, PartyPopper, Play, Target } from "lucide-react";
import { subjects } from "@/questions";
import { scopeStats } from "@/lib/mistakes";
import { getTestConfig, startTest } from "@/lib/tests";
import type { MistakesState, ProgressState } from "@/lib/types";
import { Button, LinkButton } from "./Button";
import { MistakeProgress } from "./MistakeProgress";

/** Dashboard card: all mistakes and per-subject mistakes, each with its own practice. */
export function MistakesPanel({ mistakes, progress }: { mistakes: MistakesState; progress: ProgressState }) {
  const router = useRouter();
  const all = scopeStats(mistakes, "all");

  const practice = (scope: string) => {
    const config = getTestConfig("practice", scope)!;
    if (startTest(config)) router.push(config.testPath);
  };

  // An unfinished practice is continued rather than restarted.
  const action = (scope: string, label: string, primary: boolean, ariaLabel?: string) => {
    const config = getTestConfig("practice", scope)!;
    const variant = primary ? "primary" : "secondary";
    if (progress[config.progressKey]?.active) {
      return (
        <LinkButton href={config.testPath} variant={variant} aria-label={ariaLabel && `${ariaLabel}: davom ettirish`} >
          <Play className="h-4 w-4" aria-hidden /> Davom ettirish
        </LinkButton>
      );
    }
    return (
      <Button onClick={() => practice(scope)} variant={variant} aria-label={ariaLabel && `${ariaLabel}: xatolarni mashq qilish`} >
        {label} <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    );
  };

  return (
    <section
      aria-labelledby="mistakes-heading"
      className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white shadow-sm ${
              all.pending > 0 ? "bg-gradient-to-br from-rose-500 to-orange-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"
            }`}
          >
            {all.pending > 0 ? <Target className="h-6 w-6" aria-hidden /> : <PartyPopper className="h-6 w-6" aria-hidden />}
          </span>
          <div>
            <h2 id="mistakes-heading" className="text-lg font-semibold">
              Mening xatolarim
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {all.pending > 0 ? (
                <>
                  <span className="font-semibold text-slate-900 dark:text-white">{all.pending} ta savol</span> mashq qilinishi kerak
                </>
              ) : all.total > 0 ? (
                "Hammasi joyida! 🎉 Barcha xatolaringizni o‘zlashtirdingiz."
              ) : (
                "Hammasi joyida! 🎉 Testlardagi xatolaringiz shu yerda mashq uchun to‘planadi."
              )}
            </p>
          </div>
        </div>
        {all.pending > 0 && action("all", "Barcha xatolarni mashq qilish", true)}
      </div>

      {all.total > 0 && (
        <div className="mt-5">
          <MistakeProgress mastered={all.mastered} total={all.total} />
        </div>
      )}

      {all.pending > 0 && (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject) => {
            const stats = scopeStats(mistakes, subject.id);
            return (
              <li
                key={subject.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{subject.name}</p>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    {stats.pending > 0 ? `${stats.pending} ta xato` : "Xato yo‘q ✓"}
                  </p>
                </div>
                {stats.pending > 0 && action(subject.id, "Mashq qilish", false, subject.name)}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
