"use client";

import { useSyncExternalStore } from "react";

/**
 * A JSON value persisted in localStorage and shared by every component that reads it.
 * Falls back to memory when storage is unavailable (private mode, full quota).
 */
export function createLocalStore<T extends object>(key: string, empty: () => T) {
  let cache: { raw: string | null; value: T } = { raw: null, value: empty() };
  let storageWorks = true;
  const listeners = new Set<() => void>();

  function parse(raw: string | null): T {
    if (!raw) return empty();
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? { ...empty(), ...(parsed as T) } : empty();
    } catch {
      return empty();
    }
  }

  function read(): T {
    if (!storageWorks) return cache.value;
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      storageWorks = false;
      return cache.value;
    }
    // Return the same object while storage is unchanged, as useSyncExternalStore requires.
    if (raw !== cache.raw) cache = { raw, value: parse(raw) };
    return cache.value;
  }

  function write(next: T) {
    const raw = JSON.stringify(next);
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Keep working in memory for this tab.
      storageWorks = false;
    }
    cache = { raw, value: next };
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  /** The stored value, or null during server render and hydration. */
  function useValue(): T | null {
    return useSyncExternalStore(subscribe, read, () => null);
  }

  return { read, write, useValue };
}
