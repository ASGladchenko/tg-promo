import { forwardRef } from "react";

import { useTranslation } from "react-i18next";

import "./attempts-wallet-trigger.scss";

type AttemptsWalletTriggerProps = {
  isExpanded: boolean;
  onClick: () => void;
  totalAttempts: number;
};

export const AttemptsWalletTrigger = forwardRef<HTMLButtonElement, AttemptsWalletTriggerProps>(
  function AttemptsWalletTrigger({ isExpanded, onClick, totalAttempts }, ref) {
    const { t } = useTranslation();

    return (
      <button
        ref={ref}
        className="attempts-wallet-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isExpanded}
        onClick={onClick}
      >
        <span className="attempts-wallet-trigger__copy">
          <span className="attempts-wallet-trigger__label">{t("attempts.title")}</span>
          <span className="attempts-wallet-trigger__hint">{t("attempts.openDetails")}</span>
        </span>

        <span className="attempts-wallet-trigger__balance">
          <strong className="attempts-wallet-trigger__value">{totalAttempts}</strong>
          <span className="attempts-wallet-trigger__unit">{t("attempts.shortUnit")}</span>
        </span>

        <span className="attempts-wallet-trigger__plus" aria-hidden="true">
          +
        </span>
      </button>
    );
  }
);
