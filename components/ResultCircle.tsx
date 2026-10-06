"use client";

import { useCountUp } from "@/lib/use-count-up";

export function ResultCircle({ percentage }: { percentage: number }) {
  const shown = useCountUp(percentage);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const color = percentage >= 70 ? "text-emerald-500" : percentage >= 40 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="relative h-40 w-40 shrink-0" role="img" aria-label={`${percentage}% correct`}>
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          stroke="currentColor"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center" aria-hidden>
        <span className="text-3xl font-bold tabular-nums">{shown}%</span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Correct</span>
      </div>
    </div>
  );
}
