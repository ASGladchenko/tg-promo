import { InputField } from "@/shared/ui/input-field";

import { type AdminRuleFormState } from "../model/types";
import { AdminRuleRewardFields } from "./admin-rule-reward-fields";
import { type AdminRulePrizeOption } from "./types";

import "./admin-rule-form-fields.scss";

type AdminRuleFormFieldsProps = {
  canClearSemiJackpotPrize: boolean;
  disabled: boolean;
  prizeOptions: AdminRulePrizeOption[];
};

export function AdminRuleFormFields({
  canClearSemiJackpotPrize,
  disabled,
  prizeOptions
}: AdminRuleFormFieldsProps) {
  return (
    <div className="admin-rule-form-fields">
      <InputField<AdminRuleFormState> type="date" name="gameDate" label="Game date" disabled={disabled} />
      <InputField<AdminRuleFormState>
        min={1}
        step={1}
        disabled
        type="number"
        name="codeLength"
        label="Code length"
      />

      <AdminRuleRewardFields
        disabled={disabled}
        title="Jackpot Prize"
        fieldName="jackpotPrize"
        prizeOptions={prizeOptions}
      />
      <AdminRuleRewardFields
        disabled={disabled}
        title="Semi-Jackpot Prize"
        prizeOptions={prizeOptions}
        fieldName="semiJackpotPrize"
        isNullable={canClearSemiJackpotPrize}
      />
    </div>
  );
}
