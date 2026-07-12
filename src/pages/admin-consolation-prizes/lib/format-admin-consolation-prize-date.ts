export function formatAdminConsolationPrizeDate(value: string | null): string {
  if (!value) return "Never";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
