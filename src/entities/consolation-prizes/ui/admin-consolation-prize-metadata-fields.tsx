import clsx from "clsx";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ButtonBase } from "@/shared/ui/button-base";
import { Input } from "@/shared/ui/input";
import { InputField } from "@/shared/ui/input-field";
import { TextareaField } from "@/shared/ui/textarea-field";

import { adminConsolationPrizeRequiredMetadataLanguageKeys } from "../model/admin-consolation-prize-form-schema";
import { type AdminConsolationPrizeFormState } from "../model/types";

type AdminConsolationPrizeMetadataFieldsProps = {
  disabled: boolean;
};

export function AdminConsolationPrizeMetadataFields({ disabled }: AdminConsolationPrizeMetadataFieldsProps) {
  const { control } = useFormContext<AdminConsolationPrizeFormState>();
  const { append, fields, remove } = useFieldArray<AdminConsolationPrizeFormState, "metadata">({
    control,
    name: "metadata"
  });

  return (
    <section
      className="admin-consolation-prize-form-fields__metadata"
      aria-labelledby="admin-consolation-prize-metadata-fields-title"
    >
      <div className="admin-consolation-prize-form-fields__metadata-header">
        <h3
          id="admin-consolation-prize-metadata-fields-title"
          className="admin-consolation-prize-form-fields__metadata-title"
        >
          Metadata
        </h3>

        <ButtonBase type="button" disabled={disabled} onClick={() => append({ key: "", value: "" })}>
          Add field
        </ButtonBase>
      </div>

      {adminConsolationPrizeRequiredMetadataLanguageKeys.map((languageKey, index) => (
        <div
          className={clsx("admin-consolation-prize-form-fields__metadata-item", {
            "admin-consolation-prize-form-fields__metadata-item--compact": index !== 0
          })}
          key={languageKey}
        >
          <Input
            aria-label="Field"
            label={languageKey === "ar" ? "Field" : undefined}
            value={languageKey}
            disabled
            readOnly
          />

          <TextareaField<AdminConsolationPrizeFormState>
            aria-label={`${languageKey} value`}
            label={languageKey === "ar" ? "Value" : undefined}
            name={`metadataLanguages.${languageKey}` as const}
            disabled={disabled}
            placeholder={`${languageKey} value`}
            rows={2}
            className="admin-consolation-prize-form-fields__metadata-language-value"
          />
          <span className="admin-consolation-prize-form-fields__metadata-required">Required</span>
        </div>
      ))}

      {fields.length ? (
        <div className="admin-consolation-prize-form-fields__metadata-items">
          {fields.map((field, index) => (
            <div
              className="admin-consolation-prize-form-fields__metadata-item admin-consolation-prize-form-fields__metadata-item--compact"
              key={field.id}
            >
              <InputField<AdminConsolationPrizeFormState>
                aria-label="Field"
                placeholder="code"
                disabled={disabled}
                name={`metadata.${index}.key` as const}
              />
              <InputField<AdminConsolationPrizeFormState>
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
                className="admin-consolation-prize-form-fields__metadata-remove"
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
