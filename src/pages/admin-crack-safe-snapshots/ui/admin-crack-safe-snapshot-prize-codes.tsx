import { type CrackSafeSnapshot, type CrackSafeSnapshotCode } from "@/entities/crack-safe-snapshots";

import { formatAdminCrackSafeSnapshotWins } from "../lib/format-admin-crack-safe-snapshot-wins";
import { type getAdminCrackSafeSnapshotSemiCodes } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotJackpotCodes } from "./admin-crack-safe-snapshot-jackpot-codes";
import { AdminCrackSafeSnapshotSemiCodes } from "./admin-crack-safe-snapshot-semi-codes";

type AdminCrackSafeSnapshotPrizeCodesProps = {
  jackpotCodes: CrackSafeSnapshotCode[];
  safeCodesCount: number;
  semiCodes: ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>;
  semiJackpotWinsCount: number;
  snapshot: CrackSafeSnapshot;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
  wonSemiCodes: Set<string>;
};

export function AdminCrackSafeSnapshotPrizeCodes({
  jackpotCodes,
  safeCodesCount,
  semiCodes,
  semiJackpotWinsCount,
  snapshot,
  usedPromoCodes,
  wonSemiCodes
}: AdminCrackSafeSnapshotPrizeCodesProps) {
  const semiJackpotPromoCodesCount = snapshot.semiJackpotPrize?.promoCodes.length ?? 0;

  return (
    <section className="admin-crack-safe-snapshot-details__panel admin-crack-safe-snapshot-details__panel--prizes">
      <div className="admin-crack-safe-snapshot-details__panel-heading">
        <h2>Prize Codes</h2>
        <span>{safeCodesCount} safe codes</span>
      </div>

      <div className="admin-crack-safe-snapshot-details__prizes">
        <div className="admin-crack-safe-snapshot-details__prize-section">
          <div className="admin-crack-safe-snapshot-details__prize-card-heading">
            <h3>Jackpot</h3>
            <span>
              {formatAdminCrackSafeSnapshotWins(snapshot.jackpotWinsCount, snapshot.jackpotWinsLimit)}
            </span>
          </div>

          <AdminCrackSafeSnapshotJackpotCodes
            jackpotCodes={jackpotCodes}
            snapshot={snapshot}
            usedPromoCodes={usedPromoCodes}
          />
        </div>

        <div className="admin-crack-safe-snapshot-details__prize-section">
          <div className="admin-crack-safe-snapshot-details__prize-card-heading">
            <h3>Semi Jackpot</h3>
            <span>
              {formatAdminCrackSafeSnapshotWins(semiJackpotWinsCount, semiJackpotPromoCodesCount)}
            </span>
          </div>

          <AdminCrackSafeSnapshotSemiCodes
            semiCodes={semiCodes}
            snapshot={snapshot}
            usedPromoCodes={usedPromoCodes}
            wonSemiCodes={wonSemiCodes}
          />
        </div>
      </div>
    </section>
  );
}
