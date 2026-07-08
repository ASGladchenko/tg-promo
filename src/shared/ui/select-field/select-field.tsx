import type { ReactNode } from "react";

import type { FieldValues, Path, PathValue } from "react-hook-form";
import { get, useFormContext, useWatch } from "react-hook-form";

import { Select, type SelectProps } from "../select";

export type SelectFieldRenderProps = {
  onSelect: (value: string) => void;
  value: string;
};
export interface SelectFieldProps<TFormValues extends FieldValues> extends Omit<
  SelectProps,
  "error" | "name" | "onValueChange" | "renderOptions" | "value"
> {
  name: Path<TFormValues>;
  getDisplayValue?: (value: string) => string | undefined;
  renderOptions: (props: SelectFieldRenderProps) => ReactNode;
}

export function SelectField<TFormValues extends FieldValues>({
  name,
  getDisplayValue,
  renderOptions,
  ...props
}: SelectFieldProps<TFormValues>) {
  const {
    control,
    register,
    setValue,
    formState: { errors }
  } = useFormContext<TFormValues>();

  const fieldValue = useWatch({ control, name });
  const fieldError = get(errors, name);

  const fieldProps = register(name);

  const errorMessage = typeof fieldError?.message === "string" ? fieldError.message : undefined;
  const selectValue =
    typeof fieldValue === "string" || typeof fieldValue === "number" ? String(fieldValue) : "";

  const handleValueChange = (nextValue: string) => {
    if (props.disabled) {
      return;
    }

    setValue(name, nextValue as PathValue<TFormValues, Path<TFormValues>>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <>
      <input type="hidden" {...fieldProps} value={selectValue} readOnly />
      <Select
        {...props}
        value={selectValue}
        error={errorMessage}
        displayValue={getDisplayValue?.(selectValue)}
        onValueChange={handleValueChange}
        renderOptions={({ onSelect, value }) =>
          renderOptions({
            value,
            onSelect
          })
        }
      />
    </>
  );
}
