"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCountUp } from "@/lib/use-count-up";

const tones = {
  primary: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  error: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

interface ResultCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  tone: keyof typeof tones;
}

export function ResultCard({ label, value, suffix, icon: Icon, tone }: ResultCardProps) {
  const shown = useCountUp(value);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <span className={cn("grid h-9 w-9 place-items-center rounded-lg", tones[tone])}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">
        {shown}
        {suffix && <span className="text-base font-semibold text-slate-400 dark:text-slate-500">{suffix}</span>}
      </p>
    </div>
  );
}
