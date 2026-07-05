import { useFieldArray, useFormContext } from "react-hook-form";

import { ButtonBase } from "@/shared/ui/button-base";
import { Input } from "@/shared/ui/input";
import { InputField } from "@/shared/ui/input-field";

import { type AdminPrizeFormState } from "../model/admin-prize-form-schema";

import "./admin-prize-metadata-fields.scss";

type AdminPrizeMetadataFieldsProps = {
  disabled: boolean;
};

export function AdminPrizeMetadataFields({ disabled }: AdminPrizeMetadataFieldsProps) {
  const { control } = useFormContext<AdminPrizeFormState>();
  const { append, fields, remove } = useFieldArray<AdminPrizeFormState, "metadata">({
    control,
    name: "metadata"
  });

  return (
    <section className="admin-prize-metadata-fields" aria-labelledby="admin-prize-metadata-fields-title">
      <div className="admin-prize-metadata-fields__header">
        <h3 id="admin-prize-metadata-fields-title" className="admin-prize-metadata-fields__title">
          Metadata
        </h3>

        <ButtonBase
          type="button"
          variant="dark"
          disabled={disabled}
          onClick={() => append({ key: "", value: "" })}
        >
          Add field
        </ButtonBase>
      </div>

      <div className="admin-prize-metadata-fields__item">
        <Input label="Field" value="type" disabled readOnly />

        <InputField<AdminPrizeFormState>
          label="Value"
          name="metadataType"
          disabled={disabled}
          placeholder="promo code"
        />
        <span className="admin-prize-metadata-fields__required">Required</span>
      </div>

      {fields.length ? (
        <div className="admin-prize-metadata-fields__items">
          {fields.map((field, index) => (
            <div className="admin-prize-metadata-fields__item" key={field.id}>
              <InputField<AdminPrizeFormState>
                label="Field"
                placeholder="code"
                disabled={disabled}
                name={`metadata.${index}.key` as const}
              />
              <InputField<AdminPrizeFormState>
                label="Value"
                disabled={disabled}
                placeholder="SUMMER2026"
                name={`metadata.${index}.value` as const}
              />
              <ButtonBase
                height={40}
                type="button"
                variant="danger"
                disabled={disabled}
                onClick={() => remove(index)}
                className="admin-prize-metadata-fields__remove"
              >
                Remove
              </ButtonBase>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
