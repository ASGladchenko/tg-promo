import { type CSSProperties } from "react";

import { type ConsolationPrize } from "@/entities/consolation-prizes";
import { type Prize } from "@/entities/prizes";
import { AdminConsolationPrizeUpdateTrigger } from "@/features/admin-update-consolation-prize";
import { CopyIdButton } from "@/features/copy-id";

import { formatAdminConsolationPrizeDate } from "../lib/format-admin-consolation-prize-date";

import "./admin-consolation-prize-row.scss";

type AdminConsolationPrizeRowProps = {
  consolationPrize: ConsolationPrize;
  gridTemplateColumns: string;
  prizes: Prize[];
};

export function AdminConsolationPrizeRow({
  consolationPrize,
  gridTemplateColumns,
  prizes
}: AdminConsolationPrizeRowProps) {
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;
  const linkedPrize = prizes.find((prize) => prize.id === consolationPrize.prizeId);

  return (
    <div className="consolation-row" role="row" style={rowStyle}>
      <div className="consolation-row__cell" role="cell">
        <CopyIdButton ariaLabel={`Copy consolation prize ID ${consolationPrize.id}`} id={consolationPrize.id} />
      </div>
      <div className="consolation-row__cell" role="cell">
        {linkedPrize?.name ?? consolationPrize.prizeId}
      </div>
      <div className="consolation-row__cell" role="cell">{consolationPrize.promoCode}</div>
      <div className="consolation-row__cell" role="cell">
        <span className="consolation-row__status">
          {consolationPrize.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="consolation-row__cell" role="cell">
        {formatAdminConsolationPrizeDate(consolationPrize.expiresAt)}
      </div>
      <div className="consolation-row__cell" role="cell">
        {formatAdminConsolationPrizeDate(consolationPrize.createdAt)}
      </div>
      <div className="consolation-row__cell" role="cell">
        {formatAdminConsolationPrizeDate(consolationPrize.updatedAt)}
      </div>
      <div className="consolation-row__cell consolation-row__actions" role="cell">
        <AdminConsolationPrizeUpdateTrigger consolationPrize={consolationPrize} />
      </div>
    </div>
  );
}
