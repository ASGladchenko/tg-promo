import { type ReactNode, useEffect, useState } from "react";

import clsx from "clsx";

import { copyIdToClipboard } from "../lib/copy-id-to-clipboard";

import "./copy-id-button.scss";

type CopyIdButtonProps = {
  ariaLabel: string;
  children?: ReactNode;
  id: string;
};

const copiedStateDurationMs = 300;

export function CopyIdButton({ ariaLabel, children, id }: CopyIdButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setIsCopied(false), copiedStateDurationMs);

    return () => window.clearTimeout(timeoutId);
  }, [isCopied]);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={clsx("copy-id-button", {
        "copy-id-button--copied": isCopied
      })}
      onClick={() => {
        copyIdToClipboard(id);
        setIsCopied(true);
      }}
    >
      {children ?? id}
    </button>
  );
}
