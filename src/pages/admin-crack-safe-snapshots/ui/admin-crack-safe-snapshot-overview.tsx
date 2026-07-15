import clsx from "clsx";

import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";

import { formatAdminCrackSafeSnapshotWins } from "../lib/format-admin-crack-safe-snapshot-wins";
import { isAdminCrackSafeSnapshotFinished } from "../lib/get-admin-crack-safe-snapshot-status";

import "./admin-crack-safe-snapshot-overview.scss";

type AdminCrackSafeSnapshotOverviewProps = {
  semiJackpotWinsCount: number;
  snapshot: CrackSafeSnapshot;
};

export function AdminCrackSafeSnapshotOverview({
  semiJackpotWinsCount,
  snapshot
}: AdminCrackSafeSnapshotOverviewProps) {
  const semiJackpotPromoCodesCount = snapshot.semiJackpotPrize?.promoCodes.length ?? 0;
  const isFinishedStatus = isAdminCrackSafeSnapshotFinished(snapshot.status);

  return (
    <div className="admin-crack-safe-snapshot-details__overview" aria-label="Snapshot summary">
      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Game Date</span>
        <strong>{snapshot.gameDate}</strong>
      </div>

      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Status</span>
        <mark
          className={clsx({
            "admin-crack-safe-snapshot-details__summary-status--finished": isFinishedStatus
          })}
        >
          {snapshot.status}
        </mark>
      </div>

      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Code Length</span>
        <strong>{snapshot.codeLength}</strong>
      </div>

      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Jackpot Wins</span>
        <strong>
          {formatAdminCrackSafeSnapshotWins(snapshot.jackpotWinsCount, snapshot.jackpotWinsLimit)}
        </strong>
      </div>

      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Semi Wins / All</span>
        <strong>
          {formatAdminCrackSafeSnapshotWins(semiJackpotWinsCount, semiJackpotPromoCodesCount)}
        </strong>
      </div>
    </div>
  );
}
