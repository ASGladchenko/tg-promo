import type { CSSProperties } from "react";

import { type Prize } from "@/entities/prizes";
import { AdminPrizeUpdateTrigger } from "@/features/admin-update-prize";
import { CopyIdButton } from "@/features/copy-id";

import { formatAdminPrizeDate } from "../lib/format-admin-prize-date";
import { formatAdminPrizeMetadata } from "../lib/format-admin-prize-metadata";

import "./admin-prize-row.scss";

type AdminPrizeRowProps = {
  gridTemplateColumns: string;
  prize: Prize;
};

export function AdminPrizeRow({ prize, gridTemplateColumns }: AdminPrizeRowProps) {
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;

  return (
    <div className="prize-row" role="row" style={rowStyle}>
      <div className="prize-row__cell" role="cell">
        <CopyIdButton ariaLabel={`Copy prize ID ${prize.id}`} id={prize.id} />
      </div>

      <div className="prize-row__cell" role="cell">
        {prize.name}
      </div>

      <div className="prize-row__cell" role="cell">
        {prize.description}
      </div>

      <div className="prize-row__cell" role="cell">
        <span className="prize-row__status">{prize.isActive ? "Active" : "Inactive"}</span>
      </div>

      <div className="prize-row__cell" role="cell">
        <code className="prize-row__metadata">{formatAdminPrizeMetadata(prize.metadata)}</code>
      </div>

      <div className="prize-row__cell" role="cell">
        {formatAdminPrizeDate(prize.createdAt)}
      </div>

      <div className="prize-row__cell" role="cell">
        {formatAdminPrizeDate(prize.updatedAt)}
      </div>

      <div className="prize-row__cell prize-row__actions" role="cell">
        <AdminPrizeUpdateTrigger prize={prize} />
      </div>
    </div>
  );
}
