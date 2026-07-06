import { InputField } from "@/shared/ui/input-field";

import { type AdminRuleFormState } from "../model/types";
import { AdminRuleRewardFields } from "./admin-rule-reward-fields";

import "./admin-rule-form-fields.scss";

type AdminRuleFormFieldsProps = {
  canClearSemiJackpotPrize: boolean;
  disabled: boolean;
};

export function AdminRuleFormFields({ canClearSemiJackpotPrize, disabled }: AdminRuleFormFieldsProps) {
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

      <AdminRuleRewardFields title="Jackpot Prize" fieldName="jackpotPrize" disabled={disabled} />
      <AdminRuleRewardFields
        disabled={disabled}
        title="Semi-Jackpot Prize"
        fieldName="semiJackpotPrize"
        isNullable={canClearSemiJackpotPrize}
      />
    </div>
  );
}
