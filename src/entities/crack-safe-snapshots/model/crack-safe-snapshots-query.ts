export const crackSafeSnapshotsQueryKey = ["crack-safe-snapshots"] as const;

export function crackSafeSnapshotCodesQueryKey(startDate: string | undefined) {
  return [...crackSafeSnapshotsQueryKey, startDate, "codes"] as const;
}
