export function isHalfScreen(className: string | undefined): boolean {
  return className !== undefined && className.includes("w-1/2");
}
