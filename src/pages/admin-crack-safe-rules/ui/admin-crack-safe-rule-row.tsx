import type { CSSProperties } from "react";

import { type CrackSafeRule } from "@/entities/crack-safe-rules";
import { AdminCrackSafeRuleUpdateTrigger } from "@/features/admin-update-crack-safe-rule";
import { CopyIdButton } from "@/features/copy-id";

import { formatAdminCrackSafeRuleDate } from "../lib/format-admin-crack-safe-rule-date";
import { formatAdminCrackSafeRuleReward } from "../lib/format-admin-crack-safe-rule-reward";

import "./admin-crack-safe-rule-row.scss";

type AdminCrackSafeRuleRowProps = {
  gridTemplateColumns: string;
  rule: CrackSafeRule;
};

export function AdminCrackSafeRuleRow({ rule, gridTemplateColumns }: AdminCrackSafeRuleRowProps) {
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
        <code className="admin-crack-safe-rule-row__reward">
          {formatAdminCrackSafeRuleReward(rule.jackpotPrize)}
        </code>
      </div>

      <div className="grid-table__cell" role="cell">
        <code className="admin-crack-safe-rule-row__reward">
          {formatAdminCrackSafeRuleReward(rule.semiJackpotPrize)}
        </code>
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.jackpotWinsLimit}
      </div>

      <div className="grid-table__cell" role="cell">
        {rule.semiJackpotWinsLimit}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeRuleDate(rule.createdAt)}
      </div>

      <div className="grid-table__cell" role="cell">
        {formatAdminCrackSafeRuleDate(rule.updatedAt)}
      </div>

      <div className="grid-table__cell admin-crack-safe-rule-row__actions" role="cell">
        <AdminCrackSafeRuleUpdateTrigger rule={rule} />
      </div>
    </div>
  );
}
