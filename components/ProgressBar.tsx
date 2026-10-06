import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  tone?: "primary" | "success";
  className?: string;
}

export function ProgressBar({ value, max, label, tone = "primary", className }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "success" ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-violet-500",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
