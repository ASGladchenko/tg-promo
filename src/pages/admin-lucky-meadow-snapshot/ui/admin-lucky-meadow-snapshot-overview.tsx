import clsx from "clsx";

import { type LuckyMeadowSnapshotStats } from "@/entities/lucky-meadow";

import "./admin-lucky-meadow-snapshot-overview.scss";

type AdminLuckyMeadowSnapshotOverviewProps = {
  stats: LuckyMeadowSnapshotStats;
};

export function AdminLuckyMeadowSnapshotOverview({ stats }: AdminLuckyMeadowSnapshotOverviewProps) {
  return (
    <div className="lucky-meadow-overview" aria-label="Snapshot summary">
      <div className="lucky-meadow-overview__card">
        <span>Period</span>
        <strong className="lucky-meadow-overview__period">
          {stats.startDate} - {stats.endDate}
        </strong>
      </div>

      <div className="lucky-meadow-overview__card">
        <span>Status</span>
        <mark
          className={clsx({
            "lucky-meadow-overview__status--finished": stats.status === "finished"
          })}
        >
          {stats.status}
        </mark>
      </div>

      <div className="lucky-meadow-overview__card">
        <span>Active Users</span>
        <strong>{stats.activeUsersCount}</strong>
      </div>

      <div className="lucky-meadow-overview__card">
        <span>Jackpot Wins</span>
        <strong>
          {stats.jackpotWinsCount}/{stats.jackpotWinsTotal}
        </strong>
      </div>

      <div className="lucky-meadow-overview__card">
        <span>Semi Wins / All</span>
        <strong>
          {stats.semiJackpotWinsCount}/{stats.semiJackpotWinsTotal}
        </strong>
      </div>
    </div>
  );
}
