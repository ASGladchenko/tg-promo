import { type ReactNode } from "react";

import { CheckboxField } from "@/shared/ui/checkbox-field";
import { InputField } from "@/shared/ui/input-field";
import { SelectField } from "@/shared/ui/select-field";
import { SelectOption } from "@/shared/ui/select-option";
import { TextareaField } from "@/shared/ui/textarea-field";

import { type AdminConsolationPrizeFormState, type ConsolationPrizeOption } from "../model/types";
import { AdminConsolationPrizeMetadataFields } from "./admin-consolation-prize-metadata-fields";

import "./admin-consolation-prize-form-fields.scss";

type AdminConsolationPrizeFormFieldsProps = {
  descriptionLabelAction?: ReactNode;
  disabled: boolean;
  prizeOptions: ConsolationPrizeOption[];
};

export function AdminConsolationPrizeFormFields({
  descriptionLabelAction,
  disabled,
  prizeOptions
}: AdminConsolationPrizeFormFieldsProps) {
  const getPrizeName = (id: string) => prizeOptions.find((prize) => prize.id === id)?.name;

  return (
    <div className="admin-consolation-prize-form-fields">
      <SelectField<AdminConsolationPrizeFormState>
        label="Prize"
        name="prizeId"
        disabled={disabled}
        placeholder="Select prize"
        getDisplayValue={getPrizeName}
        renderOptions={({ onSelect, value }) =>
          prizeOptions.map((prize) => (
            <SelectOption key={prize.id} value={prize.id} onSelect={onSelect} isSelected={prize.id === value}>
              {prize.name}
            </SelectOption>
          ))
        }
      />
      <InputField<AdminConsolationPrizeFormState>
        name="promoCode"
        label="Promo code"
        disabled={disabled}
        placeholder="PROMO-100"
      />
      <TextareaField<AdminConsolationPrizeFormState>
        name="description"
        label="Description"
        disabled={disabled}
        labelAction={descriptionLabelAction}
        placeholder="Consolation prize description"
      />
      <AdminConsolationPrizeMetadataFields disabled={disabled} />
      <InputField<AdminConsolationPrizeFormState>
        type="date"
        name="expiresAt"
        disabled={disabled}
        label="Expiration date"
      />
      <CheckboxField<AdminConsolationPrizeFormState> name="isActive" label="Active" disabled={disabled} />
    </div>
  );
}
