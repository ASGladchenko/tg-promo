import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

import { generatePath, useNavigate } from "react-router";

import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";
import { CopyIdButton } from "@/features/copy-id";
import { APP_ROUTES } from "@/shared/config";

import { formatAdminCrackSafeSnapshotDate } from "../lib/format-admin-crack-safe-snapshot-date";
import { formatAdminCrackSafeSnapshotPrize } from "../lib/format-admin-crack-safe-snapshot-prize";
import { formatAdminCrackSafeSnapshotWins } from "../lib/format-admin-crack-safe-snapshot-wins";

import "./admin-crack-safe-snapshot-row.scss";

type AdminCrackSafeSnapshotRowProps = {
  gridTemplateColumns: string;
  snapshot: CrackSafeSnapshot;
};

export function AdminCrackSafeSnapshotRow({
  snapshot,
  gridTemplateColumns
}: AdminCrackSafeSnapshotRowProps) {
  const navigate = useNavigate();
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;

  function openSnapshot() {
    navigate(
      `${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminCrackSafeSnapshot, {
        gameDate: snapshot.gameDate
      })}`
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSnapshot();
    }
  }

  function stopRowOpen(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <div
      className="grid-table__row grid-table__row--interactive"
      role="row"
      style={rowStyle}
      tabIndex={0}
      onClick={openSnapshot}
      onKeyDown={handleKeyDown}
    >
      <div className="grid-table__cell" role="cell" onClick={stopRowOpen}>
        <CopyIdButton ariaLabel={`Copy snapshot ID ${snapshot.id}`} id={snapshot.id} />
      </div>

      <div className="grid-table__cell" role="cell">
        {snapshot.gameDate}
      </div>

      <div className="grid-table__cell" role="cell">
        {snapshot.status}
      </div>

      <div className="grid-table__cell" role="cell">
        {snapshot.codeLength}
      </div>

      <div className="grid-table__cell" role="cell">
        <code className="admin-crack-safe-snapshot-row__prize">
          {formatAdminCrackSafeSnapshotPrize(snapshot.jackpotPrize)}
        </code>
      </div>

      <div className="grid-table__cell" role="cell">
        <code className="admin-crack-safe-snapshot-row__prize">
          {formatAdminCrackSafeSnapshotPrize(snapshot.semiJackpotPrize)}
        </code>
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeSnapshotWins(snapshot.jackpotWinsCount, snapshot.jackpotWinsLimit)}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeSnapshotWins(snapshot.semiJackpotWinsCount, snapshot.semiJackpotWinsLimit)}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeSnapshotDate(snapshot.startsAt)}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeSnapshotDate(snapshot.endsAt)}
      </div>

      <div className="grid-table__cell" role="cell" onClick={stopRowOpen}>
        <CopyIdButton ariaLabel={`Copy rules ID ${snapshot.rulesId}`} id={snapshot.rulesId} />
      </div>
    </div>
  );
}
