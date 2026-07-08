import { useFieldArray, useFormContext } from "react-hook-form";

import { ButtonBase } from "@/shared/ui/button-base";
import { Input } from "@/shared/ui/input";
import { InputField } from "@/shared/ui/input-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { adminPrizeRequiredMetadataLanguageKeys } from "../model/admin-prize-form-schema";
import { type AdminPrizeFormState } from "../model/types";

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

        <ButtonBase type="button" disabled={disabled} onClick={() => append({ key: "", value: "" })}>
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

      {adminPrizeRequiredMetadataLanguageKeys.map((languageKey) => (
        <div
          className="admin-prize-metadata-fields__item admin-prize-metadata-fields__item--compact"
          key={languageKey}
        >
          <Input aria-label="Field" value={languageKey} disabled readOnly />

          <TextareaField<AdminPrizeFormState>
            aria-label={`${languageKey} value`}
            name={`metadataLanguages.${languageKey}` as const}
            disabled={disabled}
            placeholder={`${languageKey} value`}
            rows={2}
            className="admin-prize-metadata-fields__language-value"
          />
          <span className="admin-prize-metadata-fields__required">Required</span>
        </div>
      ))}

      {fields.length ? (
        <div className="admin-prize-metadata-fields__items">
          {fields.map((field, index) => (
            <div
              className="admin-prize-metadata-fields__item admin-prize-metadata-fields__item--compact"
              key={field.id}
            >
              <InputField<AdminPrizeFormState>
                aria-label="Field"
                placeholder="code"
                disabled={disabled}
                name={`metadata.${index}.key` as const}
              />
              <InputField<AdminPrizeFormState>
                aria-label="Value"
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
