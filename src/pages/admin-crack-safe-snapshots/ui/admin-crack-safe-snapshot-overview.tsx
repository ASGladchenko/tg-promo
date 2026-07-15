import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";

import { formatAdminCrackSafeSnapshotWins } from "../lib/format-admin-crack-safe-snapshot-wins";

type AdminCrackSafeSnapshotOverviewProps = {
  snapshot: CrackSafeSnapshot;
};

export function AdminCrackSafeSnapshotOverview({ snapshot }: AdminCrackSafeSnapshotOverviewProps) {
  return (
    <div className="admin-crack-safe-snapshot-details__overview" aria-label="Snapshot summary">
      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Game Date</span>
        <strong>{snapshot.gameDate}</strong>
      </div>

      <div className="admin-crack-safe-snapshot-details__summary-card">
        <span>Status</span>
        <mark>{snapshot.status}</mark>
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
        <span>Semi Wins / Jackpot</span>
        <strong>
          {formatAdminCrackSafeSnapshotWins(
            snapshot.semiJackpotWinsCount,
            snapshot.semiJackpotWinsLimit
          )}
        </strong>
      </div>
    </div>
  );
}
