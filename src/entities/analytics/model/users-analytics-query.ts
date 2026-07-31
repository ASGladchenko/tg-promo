import { type UsersAnalyticsRange } from "./types";

export const usersAnalyticsQueryRootKey = ["users-analytics"] as const;

export function usersAnalyticsQueryKey(range: UsersAnalyticsRange) {
  return [...usersAnalyticsQueryRootKey, range.from, range.to] as const;
}
