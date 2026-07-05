import type { FieldValues, Path } from "react-hook-form";
import { get, useFormContext } from "react-hook-form";

import { Textarea, type TextareaProps } from "../textarea";

export interface TextareaFieldProps<TFormValues extends FieldValues>
  extends Omit<TextareaProps, "error" | "name"> {
  name: Path<TFormValues>;
}

export function TextareaField<TFormValues extends FieldValues>({
  name,
  ...props
}: TextareaFieldProps<TFormValues>) {
  const {
    register,
    formState: { errors }
  } = useFormContext<TFormValues>();
  const fieldError = get(errors, name);

  const errorMessage = typeof fieldError?.message === "string" ? fieldError.message : undefined;

  return <Textarea {...props} {...register(name)} error={errorMessage} />;
}
