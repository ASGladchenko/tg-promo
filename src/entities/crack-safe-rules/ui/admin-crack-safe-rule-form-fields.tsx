import { InputField } from "@/shared/ui/input-field";

import { type AdminCrackSafeRuleFormState } from "../model/types";
import { AdminCrackSafeRuleRewardFields } from "./admin-crack-safe-rule-reward-fields";
import { type AdminCrackSafeRulePrizeOption } from "./types";

import "./admin-crack-safe-rule-form-fields.scss";

type AdminCrackSafeRuleFormFieldsProps = {
  canClearSemiJackpotPrize: boolean;
  disabled: boolean;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
};

export function AdminCrackSafeRuleFormFields({
  canClearSemiJackpotPrize,
  disabled,
  prizeOptions
}: AdminCrackSafeRuleFormFieldsProps) {
  return (
    <div className="admin-crack-safe-rule-form-fields">
      <InputField<AdminCrackSafeRuleFormState>
        type="date"
        name="gameDate"
        label="Game date"
        disabled={disabled}
      />
      <InputField<AdminCrackSafeRuleFormState>
        min={1}
        step={1}
        disabled
        type="number"
        name="codeLength"
        label="Code length"
      />

      <AdminCrackSafeRuleRewardFields
        disabled={disabled}
        title="Jackpot Prize"
        fieldName="jackpotPrize"
        prizeOptions={prizeOptions}
      />

      <AdminCrackSafeRuleRewardFields
        disabled={disabled}
        title="Semi-Jackpot Prize"
        prizeOptions={prizeOptions}
        fieldName="semiJackpotPrize"
        isNullable={canClearSemiJackpotPrize}
      />
    </div>
  );
}
