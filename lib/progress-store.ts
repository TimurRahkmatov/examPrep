"use client";

import { useSyncExternalStore } from "react";
import { computeResult } from "./scoring";
import { newSeed } from "./shuffle";
import type { ProgressState, Question, SubjectProgress } from "./types";

const STORAGE_KEY = "examprep:progress:v1";

let cache: { raw: string | null; value: ProgressState } = { raw: null, value: {} };
let storageWorks = true;
const listeners = new Set<() => void>();

function parse(raw: string | null): ProgressState {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as ProgressState) : {};
  } catch {
    return {};
  }
}

function read(): ProgressState {
  if (!storageWorks) return cache.value;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    storageWorks = false;
    return cache.value;
  }
  // Return the same object while storage is unchanged, as useSyncExternalStore requires.
  if (raw !== cache.raw) cache = { raw, value: parse(raw) };
  return cache.value;
}

function write(next: ProgressState) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Private mode or full storage: keep working in memory for this tab.
    storageWorks = false;
  }
  cache = { raw, value: next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved progress for all subjects, or null during server render and hydration. */
export function useProgress(): ProgressState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

function updateSubject(subjectId: string, update: (current: SubjectProgress) => SubjectProgress) {
  const state = read();
  write({ ...state, [subjectId]: update(state[subjectId] ?? { completedCount: 0 }) });
}

export function startAttempt(subjectId: string) {
  updateSubject(subjectId, (current) => ({
    ...current,
    active: { answers: {}, currentIndex: 0, seed: newSeed(), startedAt: Date.now() },
  }));
}

export function selectAnswer(subjectId: string, questionId: number, option: string) {
  updateSubject(subjectId, (current) =>
    current.active
      ? { ...current, active: { ...current.active, answers: { ...current.active.answers, [questionId]: option } } }
      : current,
  );
}

export function goToQuestion(subjectId: string, index: number) {
  updateSubject(subjectId, (current) =>
    current.active ? { ...current, active: { ...current.active, currentIndex: index } } : current,
  );
}

export function finishAttempt(subjectId: string, questions: Question[]) {
  updateSubject(subjectId, (current) => {
    if (!current.active) return current;
    const result = computeResult(questions, current.active.answers);
    return {
      completedCount: current.completedCount + 1,
      bestPercentage: Math.max(current.bestPercentage ?? 0, result.percentage),
      lastResult: { ...result, answers: current.active.answers, finishedAt: Date.now() },
    };
  });
}
