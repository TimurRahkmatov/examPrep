import { cn } from "@/lib/cn";

interface AnswerOptionProps {
  letter: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

export function AnswerOption({ letter, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition duration-150 sm:px-5 sm:py-4",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
        selected
          ? "border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/10"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800/60",
      )}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-semibold transition",
          selected
            ? "bg-indigo-600 text-white dark:bg-indigo-500"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        )}
        aria-hidden
      >
        {letter}
      </span>
      <span className="min-w-0 flex-1 break-words text-[15px] leading-snug sm:text-base">{text}</span>
    </button>
  );
}
