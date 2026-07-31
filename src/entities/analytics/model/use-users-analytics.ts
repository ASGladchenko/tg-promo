import { useQuery } from "@tanstack/react-query";

import { getUsersAnalyticsDto } from "../api/get-users-analytics";
import { mapUsersAnalyticsDtoToUsersAnalytics } from "../lib/map-users-analytics-dto-to-users-analytics";
import { type UsersAnalyticsRange } from "./types";
import { usersAnalyticsQueryKey } from "./users-analytics-query";

export function useUsersAnalytics(range: UsersAnalyticsRange) {
  return useQuery({
    queryKey: usersAnalyticsQueryKey(range),
    queryFn: ({ signal }) => getUsersAnalyticsDto(range, signal),
    select: mapUsersAnalyticsDtoToUsersAnalytics
  });
}
