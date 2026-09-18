import { useInfiniteQuery } from "@tanstack/react-query";

import { getLuckyMeadowPeriodUsersDto } from "../api/get-lucky-meadow-period-users";
import { luckyMeadowPeriodUsersQueryKey } from "./lucky-meadow-query";

const LUCKY_MEADOW_USERS_PAGE_SIZE = 50;

export function useLuckyMeadowPeriodUsers(startDate: string | undefined, search: string) {
  const normalizedStartDate = startDate?.trim() ?? "";
  const normalizedSearch = search.trim();

  return useInfiniteQuery({
    enabled: normalizedStartDate.length > 0,
    initialPageParam: 0,
    queryKey: luckyMeadowPeriodUsersQueryKey(normalizedStartDate, normalizedSearch),
    queryFn: ({ pageParam, signal }) =>
      getLuckyMeadowPeriodUsersDto(
        {
          limit: LUCKY_MEADOW_USERS_PAGE_SIZE,
          offset: pageParam,
          search: normalizedSearch,
          startDate: normalizedStartDate
        },
        signal
      ),
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.items.length;

      return nextOffset < lastPage.total ? nextOffset : undefined;
    }
  });
}
