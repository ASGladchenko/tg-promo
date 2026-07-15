import { useQuery } from "@tanstack/react-query";

import { getCrackSafeSnapshotCodesDto } from "../api/get-crack-safe-snapshot-codes";
import { crackSafeSnapshotCodesQueryKey } from "./crack-safe-snapshots-query";

export function useCrackSafeSnapshotCodes(gameDate: string | undefined) {
  return useQuery({
    queryKey: crackSafeSnapshotCodesQueryKey(gameDate),
    queryFn: ({ signal }) => getCrackSafeSnapshotCodesDto(gameDate ?? "", signal),
    enabled: Boolean(gameDate)
  });
}
