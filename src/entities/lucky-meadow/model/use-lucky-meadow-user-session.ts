import { useQuery } from "@tanstack/react-query";

import { getLuckyMeadowUserSessionDto } from "../api/get-lucky-meadow-user-session";
import { luckyMeadowUserSessionQueryKey } from "./lucky-meadow-query";

export function useLuckyMeadowUserSession(
  startDate: string | undefined,
  userId: string | undefined,
  userSnapshotId: string | null
) {
  const normalizedStartDate = startDate?.trim() ?? "";
  const normalizedUserId = userId?.trim() ?? "";
  const normalizedUserSnapshotId = userSnapshotId?.trim() ?? "";

  return useQuery({
    enabled:
      normalizedStartDate.length > 0 && normalizedUserId.length > 0 && normalizedUserSnapshotId.length > 0,
    queryKey: luckyMeadowUserSessionQueryKey(normalizedStartDate, normalizedUserId, normalizedUserSnapshotId),
    queryFn: ({ signal }) =>
      getLuckyMeadowUserSessionDto(
        {
          startDate: normalizedStartDate,
          userId: normalizedUserId,
          userSnapshotId: normalizedUserSnapshotId
        },
        signal
      )
  });
}
