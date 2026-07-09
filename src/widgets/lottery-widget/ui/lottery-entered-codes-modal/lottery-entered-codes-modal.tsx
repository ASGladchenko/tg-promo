import { useTranslation } from "react-i18next";

import { Modal } from "@/shared/ui/modal";

import "./lottery-entered-codes-modal.scss";

type LotteryEnteredCodesModalProps = {
  codes: string[];
  isOpen: boolean;
  onClose: () => void;
};

export function LotteryEnteredCodesModal({ codes, isOpen, onClose }: LotteryEnteredCodesModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("lottery.enteredCodesModal.label")}
      className="lottery-entered-codes-modal"
    >
      <div className="lottery-entered-codes-modal__header">
        <h2 className="lottery-entered-codes-modal__title">{t("lottery.enteredCodesModal.title")}</h2>
        <button
          autoFocus
          className="lottery-entered-codes-modal__close"
          type="button"
          aria-label={t("lottery.enteredCodesModal.close")}
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <ul className="lottery-entered-codes-modal__list" dir="ltr">
        {codes.map((code) => (
          <li className="lottery-entered-codes-modal__code" key={code}>
            {code}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
