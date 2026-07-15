export function isAdminCrackSafeSnapshotActive(status: string) {
  return status.toLowerCase() === "active";
}

export function isAdminCrackSafeSnapshotFinished(status: string) {
  return status.toLowerCase() === "finished";
}
