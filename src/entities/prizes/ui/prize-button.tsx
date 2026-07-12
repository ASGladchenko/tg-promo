import { forwardRef } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import PrizeIcon from "@/shared/svg/prize.svg?react";

import "./prize-button.scss";

type PrizeButtonProps = {
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
};

export const PrizeButton = forwardRef<HTMLButtonElement, PrizeButtonProps>(function PrizeButton(
  { ariaLabel, className, onClick },
  ref
) {
  const { t } = useTranslation();

  return (
    <button
      ref={ref}
      className={clsx("prize-button", className)}
      type="button"
      aria-label={ariaLabel ?? t("lottery.prizeModal.fields.name")}
      onClick={onClick}
    >
      <PrizeIcon aria-hidden="true" focusable="false" />
    </button>
  );
});
