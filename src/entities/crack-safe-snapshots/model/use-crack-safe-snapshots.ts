import { useQuery } from "@tanstack/react-query";

import { getCrackSafeSnapshotsDto } from "../api/get-crack-safe-snapshots";
import { mapCrackSafeSnapshotsDtoToCrackSafeSnapshots } from "../lib/map-crack-safe-snapshots-dto-to-crack-safe-snapshots";
import { crackSafeSnapshotsQueryKey } from "./crack-safe-snapshots-query";

export function useCrackSafeSnapshots() {
  return useQuery({
    queryKey: crackSafeSnapshotsQueryKey,
    queryFn: ({ signal }) => getCrackSafeSnapshotsDto(signal),
    select: mapCrackSafeSnapshotsDtoToCrackSafeSnapshots
  });
}
