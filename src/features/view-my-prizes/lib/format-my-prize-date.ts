export function formatMyPrizeDate(value: string, locale: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale || "en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
