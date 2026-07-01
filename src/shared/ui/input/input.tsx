import clsx from "clsx";
import { UseFormRegister } from "react-hook-form";

import { InputBase, InputBaseProps } from "../input-base";

import "./input.scss";

export interface InputProps extends InputBaseProps {
  error?: string;
  label?: string;
}
interface InputRegister extends UseFormRegister {
  error?: string;
  label?: string;
}

export function Input({ label, error, ...props }: InputRegister) {
  console.log({ props });
  return (
    <label className={clsx("input-field", { "input-field--error": error })}>
      {label && <span className="input-field__label">{label}</span>}

      <InputBase {...props} />

      {error && <span className="input-field__error">{error}</span>}
    </label>
  );
}
