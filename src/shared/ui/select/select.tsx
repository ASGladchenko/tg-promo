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
  emptyOptionsText?: string;
  error?: string;
  label?: string;
  onValueChange: (value: string) => void;
  optionsCount?: number;
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
  optionsCount,
  onValueChange,
  renderOptions,
  placeholder = "Select",
  emptyOptionsText = "No options available",
  ...props
}: SelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const hasOptions = optionsCount === undefined || optionsCount > 0;
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

      <span className="select-field__control admin-hover-scrollbar-container">
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
          <div className="select-field__options">
            <div id={listboxId} className="select-field__options-scroll admin-hover-scrollbar" role="listbox">
              {hasOptions ? (
                renderOptions({
                  close,
                  value,
                  onSelect: (nextValue) => {
                    onValueChange(nextValue);
                    close();
                  }
                })
              ) : (
                <div className="select-field__empty-option" role="option" aria-disabled="true">
                  {emptyOptionsText}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </span>

      {error && <span className="select-field__error">{error}</span>}
    </div>
  );
}
