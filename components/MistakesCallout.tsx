"use client";

import { ArrowRight, PartyPopper, Target } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CompletedAttempt } from "@/lib/types";
import { Button, LinkButton } from "./Button";
import { MistakeProgress } from "./MistakeProgress";

interface MistakesCalloutProps {
  kind: "subject" | "practice";
  result: CompletedAttempt;
  /** Live mistake counts for this subject (or practice scope). */
  stats: { pending: number; mastered: number; total: number };
  /** True when the stats cover all subjects rather than one. */
  allSubjects: boolean;
  onPractice: () => void;
}

function Callout({ tone, icon, title, children }: { tone: "success" | "primary"; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "mt-6 rounded-2xl border p-5 shadow-sm sm:p-6",
        tone === "success"
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          : "border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10",
      )}
    >
      <div className="flex gap-4">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full",
            tone === "success"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300"
              : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}

/** The next step after a test: practice the mistakes, or celebrate when there are none. */
export function MistakesCallout({ kind, result, stats, allSubjects, onPractice }: MistakesCalloutProps) {
  const icon = <Target className="h-5 w-5" aria-hidden />;
  const party = <PartyPopper className="h-5 w-5" aria-hidden />;

  if (kind === "practice") {
    if (stats.pending === 0) {
      return (
        <Callout tone="success" icon={party} title={allSubjects ? "Barcha xatolar o‘zlashtirildi! 🎉" : "Bu fan bo‘yicha barcha xatolar o‘zlashtirildi! 🎉"}>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {allSubjects ? "Avval" : "Bu fanda avval"} noto‘g‘ri javob bergan barcha savollaringizga to‘g‘ri javob berdingiz.
          </p>
          <LinkButton href="/" className="mt-4">
            Boshqa test topshirish <ArrowRight className="h-4 w-4" aria-hidden />
          </LinkButton>
        </Callout>
      );
    }
    return (
      <Callout tone="primary" icon={icon} title={`Qolgan xatolaringiz: ${stats.pending} ta savol`}>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {result.correct > 0
            ? `Siz ${result.correct} ta xatoni o‘zlashtirdingiz. Qolganlarini ham mashq qiling.`
            : "Bu savollarni yana bir bor mashq qilib ko‘ring."}
        </p>
        <div className="mt-4">
          <MistakeProgress mastered={stats.mastered} total={stats.total} />
        </div>
        <Button onClick={onPractice} className="mt-4">
          Qolgan xatolarni mashq qilish <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </Callout>
    );
  }

  if (result.correct === result.total) {
    return (
      <Callout tone="success" icon={party} title="Mukammal natija! 🎉">
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Barcha savollarga to‘g‘ri javob berdingiz.</p>
      </Callout>
    );
  }

  // Based on the live list, so an old result never offers to start an empty practice.
  if (stats.pending === 0) return null;

  return (
    <Callout
      tone="primary"
      icon={icon}
      title={result.incorrect > 0 ? `Siz ${result.incorrect} ta xato qildingiz` : `Mashq qilinadigan xatolar: ${stats.pending} ta`}
    >
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Natijangizni yaxshilash uchun bu savollarni qayta ishlang.
        {stats.pending !== result.incorrect && ` Bu fan bo‘yicha jami ${stats.pending} ta savol mashq qilinadi.`}
      </p>
      <Button onClick={onPractice} className="mt-4">
        Xatolarni mashq qilish <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </Callout>
  );
}
