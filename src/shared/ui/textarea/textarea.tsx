import { useId } from "react";

import clsx from "clsx";

import { TextareaBase, type TextareaBaseProps } from "../textarea-base";

import "./textarea.scss";

export interface TextareaProps extends TextareaBaseProps {
  error?: string;
  label?: string;
  labelAction?: React.ReactNode;
}

export function Textarea({ id, label, labelAction, error, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={clsx("textarea-field", { "textarea-field--error": error })}>
      {(label || labelAction) && (
        <span className="textarea-field__header">
          {label && (
            <label className="textarea-field__label" htmlFor={textareaId}>
              {label}
            </label>
          )}

          {labelAction}
        </span>
      )}

      <TextareaBase id={textareaId} {...props} />

      {error && <span className="textarea-field__error">{error}</span>}
    </div>
  );
}
