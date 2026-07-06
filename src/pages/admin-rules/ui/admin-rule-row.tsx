import type { CSSProperties } from "react";

import { type Rule } from "@/entities/rules";
import { AdminRuleUpdateTrigger } from "@/features/admin-update-rule";
import { CopyIdButton } from "@/features/copy-id";

import { formatAdminRuleDate } from "../lib/format-admin-rule-date";
import { formatAdminRuleReward } from "../lib/format-admin-rule-reward";

import "./admin-rule-row.scss";

type AdminRuleRowProps = {
  gridTemplateColumns: string;
  rule: Rule;
};

export function AdminRuleRow({ rule, gridTemplateColumns }: AdminRuleRowProps) {
  const rowStyle = { "--grid-table-columns": gridTemplateColumns } as CSSProperties;

  return (
    <div className="grid-table__row" role="row" style={rowStyle}>
      <div className="grid-table__cell" role="cell">
        <CopyIdButton ariaLabel={`Copy rule ID ${rule.id}`} id={rule.id} />
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.gameDate}
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.codeLength}
      </div>

      <div className="grid-table__cell" role="cell">
        <code className="admin-rule-row__reward">{formatAdminRuleReward(rule.jackpotPrize)}</code>
      </div>

      <div className="grid-table__cell" role="cell">
        <code className="admin-rule-row__reward">{formatAdminRuleReward(rule.semiJackpotPrize)}</code>
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.jackpotWinsLimit}
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.semiJackpotWinsLimit}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminRuleDate(rule.createdAt)}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminRuleDate(rule.updatedAt)}
      </div>

      <div className="grid-table__cell admin-rule-row__actions" role="cell">
        <AdminRuleUpdateTrigger rule={rule} />
      </div>
    </div>
  );
}
