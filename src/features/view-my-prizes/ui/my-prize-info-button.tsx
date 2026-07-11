import { useTranslation } from "react-i18next";

import InfoIcon from "@/shared/svg/info.svg?react";

type MyPrizeInfoButtonProps = {
  label: string;
  onClick: () => void;
};

export function MyPrizeInfoButton({ label, onClick }: MyPrizeInfoButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      className="my-prizes-modal__info"
      type="button"
      aria-label={t("myPrizes.infoAriaLabel", { prize: label })}
      onClick={onClick}
    >
      <InfoIcon aria-hidden="true" focusable="false" />
    </button>
  );
}
