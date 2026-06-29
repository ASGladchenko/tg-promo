import clsx from "clsx";

import { InputBase, InputBaseProps } from "../input-base";

import "./input-field.scss";

export interface InputFieldProps extends InputBaseProps {
  error?: string;
  label?: string;
}

export function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <label className={clsx("input-field", { "input-field--error": error })}>
      {label && <span className="input-field__label">{label}</span>}

      <InputBase {...props} />

      {error && <span className="input-field__error">{error}</span>}
    </label>
  );
}
