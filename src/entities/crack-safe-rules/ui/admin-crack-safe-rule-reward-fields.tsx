import { type ChangeEvent } from "react";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/shared/ui/checkbox";
import { SelectField } from "@/shared/ui/select-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { type AdminCrackSafeRuleFormState } from "../model/types";
import { AdminCrackSafeRulePrizeOptions } from "./admin-crack-safe-rule-prize-options";
import { type AdminCrackSafeRulePrizeOption } from "./types";

import "./admin-crack-safe-rule-reward-fields.scss";

type AdminCrackSafeRuleRewardFieldsProps = {
  disabled: boolean;
  fieldName: "jackpotPrize" | "semiJackpotPrize";
  isNullable?: boolean;
  prizeOptions: AdminCrackSafeRulePrizeOption[];
  title: string;
};

const emptyRewardValue = {
  prizeId: "",
  promoCodes: ""
};

export function AdminCrackSafeRuleRewardFields({
  title,
  disabled,
  fieldName,
  prizeOptions,
  isNullable = false
}: AdminCrackSafeRuleRewardFieldsProps) {
  const { setValue, watch } = useFormContext<AdminCrackSafeRuleFormState>();
  const rewardValue = watch(fieldName);
  const isEnabled = rewardValue !== null;

  const handleEnabledChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(fieldName, event.target.checked ? emptyRewardValue : null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <fieldset className="admin-crack-safe-rule-reward-fields">
      <legend className="admin-crack-safe-rule-reward-fields__title">{title}</legend>

      {isNullable ? (
        <Checkbox
          checked={isEnabled}
          disabled={disabled}
          label={`Enable ${title}`}
          onChange={handleEnabledChange}
        />
      ) : null}

      {isEnabled ? (
        <div className="admin-crack-safe-rule-reward-fields__content">
          <SelectField<AdminCrackSafeRuleFormState>
            label="Prize"
            disabled={disabled}
            placeholder="Select prize"
            name={`${fieldName}.prizeId`}
            optionsCount={prizeOptions.length}
            getDisplayValue={(value) =>
              prizeOptions.find((prizeOption) => prizeOption.id === value)?.name ?? value
            }
            renderOptions={({ onSelect, value }) => (
              <AdminCrackSafeRulePrizeOptions onSelect={onSelect} prizeOptions={prizeOptions} value={value} />
            )}
          />

          <div className="admin-crack-safe-rule-reward-fields__promo-codes">
            <TextareaField<AdminCrackSafeRuleFormState>
              rows={4}
              label="Promo codes"
              disabled={disabled}
              name={`${fieldName}.promoCodes`}
              placeholder={fieldName === "jackpotPrize" ? "JACKPOT-001, JACKPOT-002" : "SEMI-001, SEMI-002"}
            />

            {fieldName === "semiJackpotPrize" ? (
              <p className="admin-crack-safe-rule-reward-fields__hint">
                Semi codes are split equally between jackpot codes.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
