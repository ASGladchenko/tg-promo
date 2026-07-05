import { CheckboxField } from "@/shared/ui/checkbox-field";
import { InputField } from "@/shared/ui/input-field";

import { type AdminPrizeFormState } from "../model/admin-prize-form-schema";
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
        placeholder="Bonus prize"
        disabled={disabled}
      />
      <InputField<AdminPrizeFormState>
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
