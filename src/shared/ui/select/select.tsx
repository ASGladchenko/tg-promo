import { type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";

import clsx from "clsx";

import { useOutsideClick } from "@/shared/lib/browser";
import ChevronDownIcon from "@/shared/svg/chevron-down.svg?react";

import { SelectBase, type SelectBaseProps } from "../select-base";

import "./select.scss";

export type SelectRenderOptionsProps = {
  close: () => void;
  onSelect: (value: string) => void;
  value: string;
};
export interface SelectProps extends Omit<SelectBaseProps, "children" | "onChange" | "value"> {
  displayValue?: string;
  error?: string;
  label?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  renderOptions: (props: SelectRenderOptionsProps) => ReactNode;
  value: string;
}

export function Select({
  label,
  error,
  value,
  disabled,
  displayValue,
  onValueChange,
  placeholder = "Select",
  renderOptions,
  ...props
}: SelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedText = displayValue || placeholder;

  const close = () => setIsOpen(false);

  useOutsideClick({
    ref: rootRef,
    enabled: isOpen,
    onOutsideClick: close
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      close();
    }
  }

  return (
    <div
      ref={rootRef}
      onKeyDown={handleKeyDown}
      className={clsx("select-field", { "select-field--error": error })}
    >
      {label && <span className="select-field__label">{label}</span>}

      <span className="select-field__control">
        <SelectBase
          {...props}
          aria-label={label}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          className={clsx({ "select-base--placeholder": !displayValue })}
          onClick={() => {
            if (!disabled) {
              setIsOpen((currentValue) => !currentValue);
            }
          }}
        >
          <span className="select-base__value">{selectedText}</span>
        </SelectBase>

        <ChevronDownIcon
          focusable="false"
          aria-hidden="true"
          className={clsx("select-field__icon", { "select-field__icon--open": isOpen })}
        />

        {isOpen ? (
          <div id={listboxId} className="select-field__options" role="listbox">
            {renderOptions({
              close,
              value,
              onSelect: (nextValue) => {
                onValueChange(nextValue);
                close();
              }
            })}
          </div>
        ) : null}
      </span>

      {error && <span className="select-field__error">{error}</span>}
    </div>
  );
}
