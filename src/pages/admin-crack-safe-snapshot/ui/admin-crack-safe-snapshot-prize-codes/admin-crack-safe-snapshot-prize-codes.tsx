import { type CrackSafeHistoryItem } from "@/entities/crack-safe-history";

import { type getAdminCrackSafeSnapshotSemiCodes } from "../../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotPrizeCodeGroup } from "../admin-crack-safe-snapshot-prize-code-group";

import "./admin-crack-safe-snapshot-prize-codes.scss";

type AdminCrackSafeSnapshotPrizeCodesProps = {
  safeCodesCount: number;
  semiCodeGroups: ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>;
  unmatchedSemiWins: CrackSafeHistoryItem[];
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
};

export function AdminCrackSafeSnapshotPrizeCodes({
  safeCodesCount,
  semiCodeGroups,
  unmatchedSemiWins,
  usedPromoCodes
}: AdminCrackSafeSnapshotPrizeCodesProps) {
  return (
    <section className="snapshot-details__panel snapshot-details__panel--prizes">
      <div className="snapshot-details__panel-heading">
        <h2>Prize Codes</h2>
        <span>{safeCodesCount} safe codes</span>
      </div>

      <div className="snapshot-details__jackpot-groups">
        {semiCodeGroups.length ? (
          semiCodeGroups.map((group, index) => (
            <AdminCrackSafeSnapshotPrizeCodeGroup
              group={group}
              isDefaultOpen={index === 0}
              key={group.id}
              usedPromoCodes={usedPromoCodes}
            />
          ))
        ) : (
          <p className="snapshot-details__empty">Snapshot safe codes are not available.</p>
        )}

        {unmatchedSemiWins.length ? (
          <div className="snapshot-details__unmatched-semi">
            <h3>Unmatched semi wins</h3>
            <div className="snapshot-details__unmatched-semi-list">
              {unmatchedSemiWins.map((item) => (
                <span key={item.id}>
                  {item.enteredCode}
                  {item.prize?.prizeData.promoCode ? ` -> ${item.prize.prizeData.promoCode}` : ""}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
