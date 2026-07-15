export const crackSafeSnapshotsQueryKey = ["crack-safe-snapshots"] as const;

export function crackSafeSnapshotCodesQueryKey(gameDate: string | undefined) {
  return [...crackSafeSnapshotsQueryKey, gameDate, "codes"] as const;
}
