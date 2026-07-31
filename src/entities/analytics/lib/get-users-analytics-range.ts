import { type UsersAnalyticsRange } from "../model/types";

const millisecondsInDay = 24 * 60 * 60 * 1000;

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getUsersAnalyticsRange(dayCount: number, baseDate = new Date()): UsersAnalyticsRange {
  if (!Number.isInteger(dayCount) || dayCount < 1) {
    throw new RangeError("Users analytics day count must be a positive integer");
  }

  const toTimestamp = Date.UTC(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), baseDate.getUTCDate());
  const fromTimestamp = toTimestamp - (dayCount - 1) * millisecondsInDay;

  return {
    from: formatDateOnly(new Date(fromTimestamp)),
    to: formatDateOnly(new Date(toTimestamp))
  };
}
