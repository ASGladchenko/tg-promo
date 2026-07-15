export function isCrackSafeSnapshotActive(status: string) {
  return status.toLowerCase() === "active";
}

export function isCrackSafeSnapshotFinished(status: string) {
  return status.toLowerCase() === "finished";
}
