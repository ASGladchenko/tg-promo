import { useId, useState } from "react";

import { useTranslation } from "react-i18next";

import { type UserPrize } from "@/entities/prizes";
import ChevronDownIcon from "@/shared/svg/chevron-down.svg?react";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";
import { Modal } from "@/shared/ui/modal";

import { MyPrizeDetails } from "./my-prize-details";
import { MyPrizeRow } from "./my-prize-row";

import "./my-prizes-modal.scss";

type MyPrizesModalProps = {
  isError: boolean;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  prizes: UserPrize[];
};

export function MyPrizesModal({ isError, isLoading, isOpen, onClose, prizes }: MyPrizesModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const [selectedPrize, setSelectedPrize] = useState<UserPrize | null>(null);

  function handleClose() {
    setSelectedPrize(null);
    onClose();
  }

  function handleBack() {
    setSelectedPrize(null);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={t("myPrizes.modalLabel")}
      className="my-prizes-modal"
    >
      <div className="my-prizes-modal__sticky">
        <div className="my-prizes-modal__header">
          <div className="my-prizes-modal__heading">
            {selectedPrize ? (
              <button
                autoFocus
                className="my-prizes-modal__icon-button my-prizes-modal__back"
                type="button"
                aria-label={t("myPrizes.back")}
                onClick={handleBack}
              >
                <ChevronDownIcon aria-hidden="true" focusable="false" />
              </button>
            ) : null}

            <div className="my-prizes-modal__title-copy">
              <p className="my-prizes-modal__eyebrow">{t("myPrizes.eyebrow")}</p>
              <h2 id={titleId} className="my-prizes-modal__title">
                {selectedPrize ? t("myPrizes.descriptionTitle") : t("myPrizes.title")}
              </h2>
            </div>
          </div>

          <button
            autoFocus={!selectedPrize}
            className="my-prizes-modal__icon-button my-prizes-modal__close"
            type="button"
            aria-label={t("myPrizes.close")}
            onClick={handleClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>

      <div className="my-prizes-modal__body">
        {selectedPrize ? (
          <MyPrizeDetails prize={selectedPrize} />
        ) : isLoading ? (
          <div
            className="my-prizes-modal__state my-prizes-modal__state--loading"
            role="status"
            aria-live="polite"
          >
            <CircularProgressLoader className="my-prizes-modal__loader" size={34} />
            <span>{t("myPrizes.loading")}</span>
          </div>
        ) : isError ? (
          <p className="my-prizes-modal__state my-prizes-modal__state--error" role="alert">
            {t("myPrizes.error")}
          </p>
        ) : prizes.length > 0 ? (
          <ul className="my-prizes-modal__list" aria-labelledby={titleId}>
            {prizes.map((prize) => (
              <MyPrizeRow key={prize.id} prize={prize} onInfoClick={setSelectedPrize} />
            ))}
          </ul>
        ) : (
          <p className="my-prizes-modal__state" role="status" aria-live="polite">
            {t("myPrizes.empty")}
          </p>
        )}
      </div>
    </Modal>
  );
}
