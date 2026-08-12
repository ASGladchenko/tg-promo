import { type CrackSafeSnapshot, type CrackSafeSnapshotCode } from "@/entities/crack-safe-snapshots";

import { isAdminCrackSafeSnapshotFinished } from "./get-admin-crack-safe-snapshot-status";

export function getAdminCrackSafeSnapshotUsedPromoCodes(
  snapshot: CrackSafeSnapshot,
  codes: CrackSafeSnapshotCode[] | undefined
) {
  const jackpot = new Set<string>();
  const expiredJackpot = new Set<string>();
  const semiJackpot = new Set<string>();
  const expiredSemiJackpot = new Set<string>();

  codes?.forEach((code) => {
    if (code.status === "won") {
      const jackpotPromoCode = snapshot.jackpotPrize?.promoCodes[code.sequence - 1];

      if (jackpotPromoCode) {
        jackpot.add(jackpotPromoCode);
      }
    }

    snapshot.semiJackpotPrize?.promoCodes.slice(0, code.semiJackpotWinsCount).forEach((promoCode) => {
      semiJackpot.add(promoCode);
    });

    code.expiredSemiJackpotCodes.forEach((promoCode) => {
      expiredSemiJackpot.add(promoCode);
      semiJackpot.add(promoCode);
    });
  });

  if (isAdminCrackSafeSnapshotFinished(snapshot.status)) {
    snapshot.jackpotPrize?.promoCodes.forEach((promoCode) => {
      if (!jackpot.has(promoCode)) {
        expiredJackpot.add(promoCode);
      }
    });

    snapshot.semiJackpotPrize?.promoCodes.forEach((promoCode) => {
      if (!semiJackpot.has(promoCode)) {
        expiredSemiJackpot.add(promoCode);
      }
    });
  }

  return { expiredJackpot, expiredSemiJackpot, jackpot, semiJackpot };
}
