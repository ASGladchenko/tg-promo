import type { ReactNode } from "react";

import clsx from "clsx";

import { CheckboxBase, type CheckboxBaseProps } from "../checkbox-base";

import "./checkbox.scss";

export interface CheckboxProps extends CheckboxBaseProps {
  error?: string;
  label?: ReactNode;
}

export function Checkbox({ label, error, ...props }: CheckboxProps) {
  return (
    <label className={clsx("checkbox", { "checkbox--error": error, "checkbox--disabled": props.disabled })}>
      <span className="checkbox__content">
        <CheckboxBase {...props} />
        {label && <span className="checkbox__label">{label}</span>}
      </span>

      {error && <span className="checkbox__error">{error}</span>}
    </label>
  );
}
