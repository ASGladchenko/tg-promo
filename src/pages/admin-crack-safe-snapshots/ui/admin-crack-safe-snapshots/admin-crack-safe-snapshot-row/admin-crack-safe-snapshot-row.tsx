import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

import { generatePath, useNavigate } from "react-router";

import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";
import { CopyIdButton } from "@/features/copy-id";
import { APP_ROUTES } from "@/shared/config";

import { formatAdminCrackSafeSnapshotDate } from "../../../lib/format-admin-crack-safe-snapshot-date";
import { formatAdminCrackSafeSnapshotWins } from "../../../lib/format-admin-crack-safe-snapshot-wins";

import "./admin-crack-safe-snapshot-row.scss";

type AdminCrackSafeSnapshotRowProps = {
  gridTemplateColumns: string;
  semiJackpotWinsCount: number;
  snapshot: CrackSafeSnapshot;
};

export function AdminCrackSafeSnapshotRow({
  semiJackpotWinsCount,
  snapshot,
  gridTemplateColumns
}: AdminCrackSafeSnapshotRowProps) {
  const navigate = useNavigate();
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;
  const jackpotPromoCodesCount = snapshot.jackpotPrize?.promoCodes.length ?? 0;
  const semiJackpotPromoCodesCount = snapshot.semiJackpotPrize?.promoCodes.length ?? 0;
  const semiJackpotPromoCodesPerJackpot = jackpotPromoCodesCount
    ? semiJackpotPromoCodesCount / jackpotPromoCodesCount
    : 0;

  function openSnapshot() {
    navigate(
      `${APP_ROUTES.admin}/${generatePath(APP_ROUTES.adminCrackSafeSnapshot, {
        startDate: snapshot.startDate
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
      className="snapshot-row"
      role="row"
      style={rowStyle}
      tabIndex={0}
      onClick={openSnapshot}
      onKeyDown={handleKeyDown}
    >
      <div className="snapshot-row__cell" role="cell" onClick={stopRowOpen}>
        <CopyIdButton ariaLabel={`Copy snapshot ID ${snapshot.id}`} id={snapshot.id} />
      </div>

      <div className="snapshot-row__cell" role="cell">
        {snapshot.startDate}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {snapshot.endDate}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {snapshot.status}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {snapshot.codeLength}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {jackpotPromoCodesCount}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {semiJackpotPromoCodesPerJackpot}/{semiJackpotPromoCodesCount}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {formatAdminCrackSafeSnapshotWins(snapshot.jackpotWinsCount, snapshot.jackpotWinsLimit)}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {formatAdminCrackSafeSnapshotWins(semiJackpotWinsCount, semiJackpotPromoCodesCount)}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {formatAdminCrackSafeSnapshotDate(snapshot.startsAt)}
      </div>

      <div className="snapshot-row__cell" role="cell">
        {formatAdminCrackSafeSnapshotDate(snapshot.endsAt)}
      </div>

      <div className="snapshot-row__cell" role="cell" onClick={stopRowOpen}>
        <CopyIdButton ariaLabel={`Copy rules ID ${snapshot.rulesId}`} id={snapshot.rulesId} />
      </div>
    </div>
  );
}
