import type { FieldValues, Path } from "react-hook-form";
import { get, useFormContext } from "react-hook-form";

import { Input, type InputProps } from "../input";

export interface InputFieldProps<TFormValues extends FieldValues> extends Omit<InputProps, "error" | "name"> {
  name: Path<TFormValues>;
}

export function InputField<TFormValues extends FieldValues>({
  name,
  ...props
}: InputFieldProps<TFormValues>) {
  const {
    register,
    formState: { errors }
  } = useFormContext<TFormValues>();
  const fieldError = get(errors, name);

  const errorMessage = typeof fieldError?.message === "string" ? fieldError.message : undefined;

  return <Input {...props} {...register(name)} error={errorMessage} />;
}
