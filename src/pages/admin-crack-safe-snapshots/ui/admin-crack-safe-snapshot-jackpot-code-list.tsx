import clsx from "clsx";

import { type CrackSafeSnapshotCode, type CrackSafeSnapshotPrize } from "@/entities/crack-safe-snapshots";

type AdminCrackSafeSnapshotJackpotCodeListProps = {
  jackpotCodes: CrackSafeSnapshotCode[];
  jackpotPrize: CrackSafeSnapshotPrize | null;
};

export function AdminCrackSafeSnapshotJackpotCodeList({
  jackpotCodes,
  jackpotPrize
}: AdminCrackSafeSnapshotJackpotCodeListProps) {
  return (
    <div className="admin-crack-safe-snapshot-details__jackpot-codes">
      <div className="admin-crack-safe-snapshot-details__jackpot-code admin-crack-safe-snapshot-details__jackpot-code--head">
        <span>Safe Code</span>
        <span>Status</span>
        <span>Promo Code</span>
      </div>

      {jackpotCodes.map((code) => (
        <div className="admin-crack-safe-snapshot-details__jackpot-code" key={code.id}>
          <span
            className={clsx("admin-crack-safe-snapshot-details__jackpot-safe-code", {
              "admin-crack-safe-snapshot-details__jackpot-safe-code--won": code.status === "won"
            })}
          >
            {code.code}
          </span>
          <span
            className={clsx("admin-crack-safe-snapshot-details__jackpot-code-status", {
              "admin-crack-safe-snapshot-details__jackpot-code-status--active": code.status === "active",
              "admin-crack-safe-snapshot-details__jackpot-code-status--won": code.status === "won"
            })}
          >
            {code.status}
          </span>
          <span
            className={clsx("admin-crack-safe-snapshot-details__jackpot-code-promo", {
              "admin-crack-safe-snapshot-details__jackpot-code-promo--used": code.status === "won"
            })}
          >
            {jackpotPrize?.promoCodes[code.sequence - 1] ?? "None"}
          </span>
        </div>
      ))}
    </div>
  );
}
