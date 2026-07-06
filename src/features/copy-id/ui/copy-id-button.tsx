import { type ReactNode } from "react";

import clsx from "clsx";

import { useCopy } from "@/shared/lib/browser";

import "./copy-id-button.scss";

type CopyIdButtonProps = {
  ariaLabel: string;
  children?: ReactNode;
  id: string;
};

export function CopyIdButton({ ariaLabel, children, id }: CopyIdButtonProps) {
  const { isCopied, onCopy } = useCopy(id);

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      className={clsx("copy-id-button", {
        "copy-id-button--copied": isCopied
      })}
    >
      {children ?? id}
    </button>
  );
}
