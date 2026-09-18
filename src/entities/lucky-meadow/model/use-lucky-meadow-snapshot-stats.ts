import { useQuery } from "@tanstack/react-query";

import { getLuckyMeadowSnapshotStatsDto } from "../api/get-lucky-meadow-snapshot-stats";
import { luckyMeadowSnapshotStatsQueryKey } from "./lucky-meadow-query";

const SNAPSHOT_STATS_REFRESH_INTERVAL_MS = 30_000;

export function useLuckyMeadowSnapshotStats(startDate: string | undefined) {
  const normalizedStartDate = startDate?.trim() ?? "";

  return useQuery({
    enabled: normalizedStartDate.length > 0,
    queryFn: ({ signal }) => getLuckyMeadowSnapshotStatsDto(normalizedStartDate, signal),
    queryKey: luckyMeadowSnapshotStatsQueryKey(normalizedStartDate),
    refetchInterval: SNAPSHOT_STATS_REFRESH_INTERVAL_MS
  });
}
