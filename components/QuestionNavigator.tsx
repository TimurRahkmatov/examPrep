"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { QuestionStatus } from "@/lib/types";

const statusClasses: Record<QuestionStatus, string> = {
  unanswered:
    "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
  answered: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400",
  correct: "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500",
  incorrect: "bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500",
};

const statusLabels: Record<QuestionStatus, string> = {
  unanswered: "Javobsiz",
  answered: "Javob berilgan",
  correct: "To‘g‘ri",
  incorrect: "Noto‘g‘ri",
};

interface QuestionNavigatorProps {
  statuses: QuestionStatus[];
  currentIndex?: number;
  onSelect: (index: number) => void;
  /** "grid" wraps into rows; "strip" is a single scrollable row for small screens. */
  layout?: "grid" | "strip";
  legend: QuestionStatus[];
}

export function QuestionNavigator({ statuses, currentIndex, onSelect, layout = "grid", legend }: QuestionNavigatorProps) {
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (layout === "strip") currentRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [currentIndex, layout]);

  return (
    <nav aria-label="Savollar navigatori">
      <ol
        className={cn(
          layout === "grid"
            ? "grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5"
            : "-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:thin]",
        )}
      >
        {statuses.map((status, index) => {
          const current = index === currentIndex;
          return (
            <li key={index} className={layout === "strip" ? "snap-center" : undefined}>
              <button
                type="button"
                ref={current ? currentRef : undefined}
                onClick={() => onSelect(index)}
                aria-current={current ? "step" : undefined}
                aria-label={`${index + 1}-savol, ${statusLabels[status].toLowerCase()}`}
                className={cn(
                  "grid h-9 w-full min-w-9 place-items-center rounded-lg text-xs font-semibold tabular-nums transition duration-150",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                  statusClasses[status],
                  current && "ring-2 ring-violet-500 ring-offset-2 ring-offset-white dark:ring-violet-400 dark:ring-offset-slate-900",
                )}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        {legend.map((status) => (
          <li key={status} className="inline-flex items-center gap-1.5">
            <span className={cn("h-3 w-3 rounded", statusClasses[status])} aria-hidden />
            {statusLabels[status]}
          </li>
        ))}
      </ul>
    </nav>
  );
}
