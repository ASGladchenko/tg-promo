import type { ChangeEvent } from "react";

import type { FieldValues, Path } from "react-hook-form";
import { get, useFormContext, useWatch } from "react-hook-form";

import { Input, type InputProps } from "../input";

export interface InputFieldProps<TFormValues extends FieldValues> extends Omit<InputProps, "error" | "name"> {
  name: Path<TFormValues>;
}

export function InputField<TFormValues extends FieldValues>({
  name,
  onChange,
  ...props
}: InputFieldProps<TFormValues>) {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext<TFormValues>();
  const fieldValue = useWatch({ control, name });
  const fieldError = get(errors, name);
  const { onChange: onFieldChange, ...fieldProps } = register(name);

  const errorMessage = typeof fieldError?.message === "string" ? fieldError.message : undefined;

  const inputValue = typeof fieldValue === "string" || typeof fieldValue === "number" ? fieldValue : "";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (props.disabled || props.readOnly) {
      return;
    }

    void onFieldChange(event);
    onChange?.(event);
  };

  return <Input {...props} {...fieldProps} value={inputValue} onChange={handleChange} error={errorMessage} />;
}
