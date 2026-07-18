import { type ReactNode, useEffect } from "react";

import clsx from "clsx";
import { createPortal } from "react-dom";

import "./modal.scss";

type ModalProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  hasOverlay?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function Modal({ isOpen, onClose, children, ariaLabel, className, hasOverlay = false }: ModalProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={clsx("modal", {
        "modal--overlay": hasOverlay
      })}
      onClick={onClose}
    >
      <div
        className={clsx("modal__content", className)}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
