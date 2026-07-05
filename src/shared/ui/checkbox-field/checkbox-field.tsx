import type { FieldValues, Path } from "react-hook-form";
import { get, useFormContext } from "react-hook-form";

import { Checkbox, type CheckboxProps } from "../checkbox";

export interface CheckboxFieldProps<TFormValues extends FieldValues> extends Omit<CheckboxProps, "error" | "name"> {
  name: Path<TFormValues>;
}

export function CheckboxField<TFormValues extends FieldValues>({ name, ...props }: CheckboxFieldProps<TFormValues>) {
  const {
    register,
    formState: { errors }
  } = useFormContext<TFormValues>();
  const fieldError = get(errors, name);

  const errorMessage = typeof fieldError?.message === "string" ? fieldError.message : undefined;

  return <Checkbox {...props} {...register(name)} error={errorMessage} />;
}
