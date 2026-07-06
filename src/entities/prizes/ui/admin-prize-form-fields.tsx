import { CheckboxField } from "@/shared/ui/checkbox-field";
import { InputField } from "@/shared/ui/input-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { type AdminPrizeFormState } from "../model/types";
import { AdminPrizeMetadataFields } from "./admin-prize-metadata-fields";

import "./admin-prize-form-fields.scss";

type AdminPrizeFormFieldsProps = {
  disabled: boolean;
};

export function AdminPrizeFormFields({ disabled }: AdminPrizeFormFieldsProps) {
  return (
    <div className="admin-prize-form-fields">
      <InputField<AdminPrizeFormState>
        name="name"
        label="Name"
        disabled={disabled}
        placeholder="Bonus prize"
      />
      <TextareaField<AdminPrizeFormState>
        name="description"
        label="Description"
        disabled={disabled}
        placeholder="Prize description"
      />

      <AdminPrizeMetadataFields disabled={disabled} />

      <CheckboxField<AdminPrizeFormState> label="Active" name="isActive" disabled={disabled} />
    </div>
  );
}
