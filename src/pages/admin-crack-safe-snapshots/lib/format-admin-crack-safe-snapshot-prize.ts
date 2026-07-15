import { type CrackSafeSnapshotPrize } from "@/entities/crack-safe-snapshots";

export function formatAdminCrackSafeSnapshotPrize(prize: CrackSafeSnapshotPrize | null) {
  if (!prize) {
    return "None";
  }

  return prize.promoCodes.join("\n");
}
