export function formatThaiDate(timestampz: string) {
  return new Date(timestampz).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
