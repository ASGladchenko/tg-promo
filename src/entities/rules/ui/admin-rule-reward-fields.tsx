import { type ChangeEvent } from "react";

import { get, type Path, useFieldArray, useFormContext } from "react-hook-form";

import { ButtonBase } from "@/shared/ui/button-base";
import { Checkbox } from "@/shared/ui/checkbox";
import { InputField } from "@/shared/ui/input-field";

import { readFieldArrayErrorMessage } from "../lib/read-field-array-error-message";
import { type AdminRuleFormState } from "../model/admin-rule-form-schema";

import "./admin-rule-reward-fields.scss";

type AdminRuleRewardFieldsProps = {
  disabled: boolean;
  fieldName: "jackpotPrize" | "semiJackpotPrize";
  isNullable?: boolean;
  title: string;
};

const emptyRewardValue = {
  prizeId: "",
  promoCodes: [{ value: "" }]
};

const emptyPromoCodeValue = { value: "" };

export function AdminRuleRewardFields({
  title,
  disabled,
  fieldName,
  isNullable = false
}: AdminRuleRewardFieldsProps) {
  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<AdminRuleFormState>();
  const rewardValue = watch(fieldName);
  const isEnabled = rewardValue !== null;
  const promoCodesFieldName = `${fieldName}.promoCodes` as "jackpotPrize.promoCodes";

  const { append, fields, remove } = useFieldArray<AdminRuleFormState, "jackpotPrize.promoCodes">({
    control,
    name: promoCodesFieldName
  });

  const promoCodesError = get(errors, `${fieldName}.promoCodes`);
  const promoCodesErrorMessage = readFieldArrayErrorMessage(promoCodesError);

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
          <InputField<AdminRuleFormState>
            name={`${fieldName}.prizeId`}
            label="Prize ID"
            disabled={disabled}
            placeholder="00000000-0000-4000-8000-000000000001"
          />

          <div className="admin-rule-reward-fields__promo-codes">
            <div className="admin-rule-reward-fields__promo-codes-header">
              <span className="admin-rule-reward-fields__label">Promo codes</span>
              <ButtonBase
                type="button"
                height={34}
                disabled={disabled}
                onClick={() => append(emptyPromoCodeValue)}
              >
                Add Code
              </ButtonBase>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="admin-rule-reward-fields__promo-code">
                <InputField<AdminRuleFormState>
                  name={`${fieldName}.promoCodes.${index}.value` as Path<AdminRuleFormState>}
                  label={`Code ${index + 1}`}
                  disabled={disabled}
                  placeholder={fieldName === "jackpotPrize" ? "JACKPOT-001" : "SEMI-001"}
                />
                <ButtonBase
                  type="button"
                  height={40}
                  variant="danger"
                  disabled={disabled || fields.length === 1}
                  onClick={() => remove(index)}
                >
                  Remove
                </ButtonBase>
              </div>
            ))}

            {promoCodesErrorMessage ? (
              <span className="admin-rule-reward-fields__error">{promoCodesErrorMessage}</span>
            ) : null}
          </div>
        </div>
      ) : null}
    </fieldset>
  );
}
