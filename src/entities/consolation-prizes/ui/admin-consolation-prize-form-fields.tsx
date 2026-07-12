import { CheckboxField } from "@/shared/ui/checkbox-field";
import { InputField } from "@/shared/ui/input-field";
import { SelectField } from "@/shared/ui/select-field";
import { SelectOption } from "@/shared/ui/select-option";
import { TextareaField } from "@/shared/ui/textarea-field";

import { type AdminConsolationPrizeFormState, type ConsolationPrizeOption } from "../model/types";

import "./admin-consolation-prize-form-fields.scss";

type AdminConsolationPrizeFormFieldsProps = {
  disabled: boolean;
  prizeOptions: ConsolationPrizeOption[];
};

export function AdminConsolationPrizeFormFields({
  disabled,
  prizeOptions
}: AdminConsolationPrizeFormFieldsProps) {
  const getPrizeName = (id: string) => prizeOptions.find((prize) => prize.id === id)?.name;

  return (
    <div className="admin-consolation-prize-form-fields">
      <SelectField<AdminConsolationPrizeFormState>
        name="prizeId"
        label="Prize"
        placeholder="Select prize"
        disabled={disabled}
        getDisplayValue={getPrizeName}
        renderOptions={({ onSelect, value }) =>
          prizeOptions.map((prize) => (
            <SelectOption
              key={prize.id}
              value={prize.id}
              onSelect={onSelect}
              isSelected={prize.id === value}
            >
              {prize.name}
            </SelectOption>
          ))
        }
      />
      <InputField<AdminConsolationPrizeFormState>
        name="promoCode"
        label="Promo code"
        placeholder="PROMO-100"
        disabled={disabled}
      />
      <TextareaField<AdminConsolationPrizeFormState>
        name="description"
        label="Description"
        placeholder="Consolation prize description"
        disabled={disabled}
      />
      <InputField<AdminConsolationPrizeFormState>
        name="expiresAt"
        label="Expiration date"
        type="date"
        disabled={disabled}
      />
      <CheckboxField<AdminConsolationPrizeFormState> name="isActive" label="Active" disabled={disabled} />
    </div>
  );
}
