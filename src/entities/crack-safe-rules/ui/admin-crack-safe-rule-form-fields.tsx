import { InputField } from "@/shared/ui/input-field";

import { type AdminCrackSafeRuleFormState } from "../model/types";
import { AdminCrackSafeRuleRewardFields } from "./admin-crack-safe-rule-reward-fields";
import { type AdminCrackSafeRulePrizeOption } from "./types";

import "./admin-crack-safe-rule-form-fields.scss";

type AdminCrackSafeRuleFormFieldsProps = {
  canClearSemiJackpotPrize: boolean;
  disabled: boolean;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  shouldShowPeriodFields?: boolean;
};

export function AdminCrackSafeRuleFormFields({
  canClearSemiJackpotPrize,
  disabled,
  prizeOptions,
  shouldShowPeriodFields = true
}: AdminCrackSafeRuleFormFieldsProps) {
  return (
    <div className="admin-crack-safe-rule-form-fields">
      {shouldShowPeriodFields ? (
        <>
          <InputField<AdminCrackSafeRuleFormState>
            type="date"
            name="startDate"
            label="Start date"
            disabled={disabled}
          />
          <InputField<AdminCrackSafeRuleFormState>
            type="date"
            name="endDate"
            label="End date"
            disabled={disabled}
          />
        </>
      ) : null}

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
