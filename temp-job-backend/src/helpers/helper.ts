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
