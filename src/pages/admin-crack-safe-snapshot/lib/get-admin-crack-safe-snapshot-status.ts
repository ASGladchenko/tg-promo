import { isCrackSafeSnapshotActive, isCrackSafeSnapshotFinished } from "@/entities/crack-safe-snapshots";

export function isAdminCrackSafeSnapshotActive(status: string) {
  return isCrackSafeSnapshotActive(status);
}

export function isAdminCrackSafeSnapshotFinished(status: string) {
  return isCrackSafeSnapshotFinished(status);
}
