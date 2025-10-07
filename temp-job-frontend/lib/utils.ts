import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortByThai(array: any[], key: string) {
  return array?.sort((a, b) => a[key].localeCompare(b[key], "th"));
}

export async function withCatch<T>(
  fn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();

    return [result, null];
  } catch (error: any) {
    return [null, error];
  }
}
