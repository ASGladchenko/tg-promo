import { useQuery } from "@tanstack/react-query";

import { getCrackSafeSnapshotCodesDto } from "../api/get-crack-safe-snapshot-codes";
import { crackSafeSnapshotCodesQueryKey } from "./crack-safe-snapshots-query";

export function useCrackSafeSnapshotCodes(startDate: string | undefined, refetchInterval?: number | false) {
  return useQuery({
    queryKey: crackSafeSnapshotCodesQueryKey(startDate),
    queryFn: ({ signal }) => getCrackSafeSnapshotCodesDto(startDate ?? "", signal),
    enabled: Boolean(startDate),
    refetchInterval
  });
}
