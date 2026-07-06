import clsx from "clsx";

import { TextareaBase, type TextareaBaseProps } from "../textarea-base";

import "./textarea.scss";

export interface TextareaProps extends TextareaBaseProps {
  error?: string;
  label?: string;
}

export function Textarea({ label, error, ...props }: TextareaProps) {
  return (
    <label className={clsx("textarea-field", { "textarea-field--error": error })}>
      {label && <span className="textarea-field__label">{label}</span>}

      <TextareaBase {...props} />

      {error && <span className="textarea-field__error">{error}</span>}
    </label>
  );
}
