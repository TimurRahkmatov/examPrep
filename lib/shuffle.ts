import type { Question } from "./types";

// Small deterministic PRNG so a given seed always produces the same order.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleOptions(question: Question, seed: number): string[] {
  const random = mulberry32(seed ^ Math.imul(question.id, 2654435761));
  const options = [...question.options];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}
