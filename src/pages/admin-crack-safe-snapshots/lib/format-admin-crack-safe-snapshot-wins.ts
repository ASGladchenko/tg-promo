export function formatAdminCrackSafeSnapshotWins(count: number | null | undefined, limit: number) {
  const safeCount = typeof count === "number" && Number.isFinite(count) ? count : 0;
  const safeLimit = Number.isFinite(limit) ? limit : 0;

  return `${safeCount}/${safeLimit}`;
}
