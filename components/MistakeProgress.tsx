import { ProgressBar } from "./ProgressBar";

/** "14 / 18 mastered": former mistakes answered correctly in practice, out of all mistakes ever made. */
export function MistakeProgress({ mastered, total }: { mastered: number; total: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Xatolar bo‘yicha natija</span>
        <span className="font-medium tabular-nums">
          {mastered} / {total} o‘zlashtirildi
        </span>
      </div>
      <ProgressBar value={mastered} max={total} label="O‘zlashtirilgan xatolar" tone="success" />
    </div>
  );
}
