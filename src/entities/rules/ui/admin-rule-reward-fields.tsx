import { type ChangeEvent } from "react";

import { useFormContext } from "react-hook-form";

import { Checkbox } from "@/shared/ui/checkbox";
import { SelectField } from "@/shared/ui/select-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { type AdminRuleFormState } from "../model/types";
import { AdminRulePrizeOptions } from "./admin-rule-prize-options";
import { type AdminRulePrizeOption } from "./types";

import "./admin-rule-reward-fields.scss";

type AdminRuleRewardFieldsProps = {
  disabled: boolean;
  fieldName: "jackpotPrize" | "semiJackpotPrize";
  isNullable?: boolean;
  prizeOptions: AdminRulePrizeOption[];
  title: string;
};

const emptyRewardValue = {
  prizeId: "",
  promoCodes: ""
};

export function AdminRuleRewardFields({
  title,
  disabled,
  fieldName,
  prizeOptions,
  isNullable = false
}: AdminRuleRewardFieldsProps) {
  const { setValue, watch } = useFormContext<AdminRuleFormState>();
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
    <fieldset className="admin-rule-reward-fields">
      <legend className="admin-rule-reward-fields__title">{title}</legend>

      {isNullable ? (
        <Checkbox
          checked={isEnabled}
          disabled={disabled}
          label={`Enable ${title}`}
          onChange={handleEnabledChange}
        />
      ) : null}

      {isEnabled ? (
        <div className="admin-rule-reward-fields__content">
          <SelectField<AdminRuleFormState>
            label="Prize"
            disabled={disabled}
            placeholder="Select prize"
            name={`${fieldName}.prizeId`}
            getDisplayValue={(value) =>
              prizeOptions.find((prizeOption) => prizeOption.id === value)?.name ?? value
            }
            renderOptions={({ onSelect, value }) => (
              <AdminRulePrizeOptions onSelect={onSelect} prizeOptions={prizeOptions} value={value} />
            )}
          />

          <div className="admin-rule-reward-fields__promo-codes">
            <TextareaField<AdminRuleFormState>
              rows={4}
              label="Promo codes"
              disabled={disabled}
              name={`${fieldName}.promoCodes`}
              placeholder={fieldName === "jackpotPrize" ? "JACKPOT-001, JACKPOT-002" : "SEMI-001, SEMI-002"}
            />
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
