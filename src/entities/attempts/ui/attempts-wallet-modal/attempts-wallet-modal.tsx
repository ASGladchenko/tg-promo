import { type ReactNode, useId } from "react";

import { useTranslation } from "react-i18next";

import { Modal } from "@/shared/ui/modal";

import { type AttemptsWalletData } from "../../model/types";

import "./attempts-wallet-modal.scss";

type AttemptsWalletModalProps = {
  children: ReactNode;
  data: AttemptsWalletData | null;
  isOpen: boolean;
  onClose: () => void;
  statusMessage?: string;
};

export function AttemptsWalletModal({
  children,
  data,
  isOpen,
  onClose,
  statusMessage = ""
}: AttemptsWalletModalProps) {
  const { t } = useTranslation();
  const dailyTitleId = useId();
  const rewardsTitleId = useId();

  if (!data) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("attempts.dialogLabel")}
      className="attempts-wallet-modal"
    >
      <div className="attempts-wallet-modal__sticky">
        <div className="attempts-wallet-modal__header">
          <div>
            <p className="attempts-wallet-modal__eyebrow">{t("attempts.walletLabel")}</p>
            <h2 className="attempts-wallet-modal__title">{t("attempts.dialogTitle")}</h2>
          </div>

          <button
            autoFocus
            className="attempts-wallet-modal__close"
            type="button"
            aria-label={t("attempts.close")}
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div dir="ltr" className="attempts-wallet-modal__balance">
          <div className="attempts-wallet-modal__balance-part">
            <strong className="attempts-wallet-modal__balance-value">{data.permanentAttempts}</strong>
            <span className="attempts-wallet-modal__balance-label">{t("attempts.permanent")}</span>
          </div>
          <span className="attempts-wallet-modal__balance-plus" aria-hidden="true">
            +
          </span>
          <div className="attempts-wallet-modal__balance-part">
            <strong className="attempts-wallet-modal__balance-value attempts-wallet-modal__balance-value--daily">
              {data.dailyAttempts}
            </strong>
            <span className="attempts-wallet-modal__balance-label">{t("attempts.expiring")}</span>
          </div>
        </div>
      </div>

      <div className="attempts-wallet-modal__body">
        <section className="attempts-wallet-modal__daily" aria-labelledby={dailyTitleId}>
          <span className="attempts-wallet-modal__daily-copy">
            <strong id={dailyTitleId} className="attempts-wallet-modal__daily-title">
              {t("attempts.dailyTitle")}
            </strong>
            <span className="attempts-wallet-modal__daily-note">
              {t("attempts.dailyExpires", { time: "UNKNOWN" })}
            </span>
          </span>
          <strong dir="ltr" className="attempts-wallet-modal__daily-value">
            +{data.dailyAttempts}
          </strong>
        </section>

        <section className="attempts-wallet-modal__section" aria-labelledby={rewardsTitleId}>
          <div className="attempts-wallet-modal__section-heading">
            <h3 id={rewardsTitleId} className="attempts-wallet-modal__section-title">
              {t("attempts.rewardsTitle")}
            </h3>
            <p className="attempts-wallet-modal__section-text">{t("attempts.rewardsText")}</p>
          </div>

          <ul className="attempts-wallet-modal__rewards">{children}</ul>

          <p className="attempts-wallet-modal__feedback" role="status" aria-live="polite">
            {statusMessage}
          </p>
        </section>
      </div>
    </Modal>
  );
}
