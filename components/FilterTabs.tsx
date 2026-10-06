import { cn } from "@/lib/cn";
import type { ReviewFilter } from "@/lib/types";

interface FilterTabsProps {
  value: ReviewFilter;
  counts: Record<ReviewFilter, number>;
  onChange: (filter: ReviewFilter) => void;
}

const tabs: { id: ReviewFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "correct", label: "Correct" },
  { id: "incorrect", label: "Incorrect" },
  { id: "unanswered", label: "Unanswered" },
];

export function FilterTabs({ value, counts, onChange }: FilterTabsProps) {
  return (
    <div role="tablist" aria-label="Filter questions" className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/70">
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition sm:flex-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
              selected
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                selected ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300" : "bg-slate-200 dark:bg-slate-700",
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
