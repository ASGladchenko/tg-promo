import { useInfiniteQuery } from "@tanstack/react-query";

import { getLuckyMeadowUserSessionsDto } from "../api/get-lucky-meadow-user-sessions";
import { luckyMeadowUserSessionsQueryKey } from "./lucky-meadow-query";

const LUCKY_MEADOW_USER_SESSIONS_PAGE_SIZE = 50;
const LUCKY_MEADOW_USER_SESSIONS_REFETCH_INTERVAL = 60_000;

export function useLuckyMeadowUserSessions(startDate: string | undefined, userId: string | undefined) {
  const normalizedStartDate = startDate?.trim() ?? "";
  const normalizedUserId = userId?.trim() ?? "";

  return useInfiniteQuery({
    enabled: normalizedStartDate.length > 0 && normalizedUserId.length > 0,
    initialPageParam: 0,
    queryKey: luckyMeadowUserSessionsQueryKey(normalizedStartDate, normalizedUserId),
    refetchInterval: LUCKY_MEADOW_USER_SESSIONS_REFETCH_INTERVAL,
    queryFn: ({ pageParam, signal }) =>
      getLuckyMeadowUserSessionsDto(
        {
          limit: LUCKY_MEADOW_USER_SESSIONS_PAGE_SIZE,
          offset: pageParam,
          startDate: normalizedStartDate,
          userId: normalizedUserId
        },
        signal
      ),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.items.length;

      return nextOffset < lastPage.total ? nextOffset : undefined;
    }
  });
}
