import { useQuery } from "@tanstack/react-query";

import { getCrackSafeSnapshotsDto } from "../api/get-crack-safe-snapshots";
import { isCrackSafeSnapshotActive } from "../lib/get-crack-safe-snapshot-status";
import { mapCrackSafeSnapshotsDtoToCrackSafeSnapshots } from "../lib/map-crack-safe-snapshots-dto-to-crack-safe-snapshots";
import { crackSafeSnapshotsQueryKey } from "./crack-safe-snapshots-query";

export function useCrackSafeSnapshots(activeStartDate?: string, activeSnapshotRefetchInterval?: number) {
  return useQuery({
    queryKey: crackSafeSnapshotsQueryKey,
    queryFn: ({ signal }) => getCrackSafeSnapshotsDto(signal),
    refetchInterval: (query) => {
      const snapshots = query.state.data
        ? mapCrackSafeSnapshotsDtoToCrackSafeSnapshots(query.state.data)
        : [];
      const snapshot = snapshots.find((item) => item.startDate === activeStartDate);

      return snapshot && isCrackSafeSnapshotActive(snapshot.status) ? (activeSnapshotRefetchInterval ?? false) : false;
    },
    select: mapCrackSafeSnapshotsDtoToCrackSafeSnapshots
  });
}
