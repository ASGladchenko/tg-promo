import { useTranslation } from "react-i18next";

import { Modal } from "@/shared/ui/modal";

import "./lottery-duplicate-code-modal.scss";

type LotteryDuplicateCodeModalProps = {
  code: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LotteryDuplicateCodeModal({
  code,
  isOpen,
  onCancel,
  onConfirm
}: LotteryDuplicateCodeModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabel={t("lottery.duplicateCodeModal.label")}
      className="lottery-duplicate-code-modal"
    >
      <h2 className="lottery-duplicate-code-modal__title">{t("lottery.duplicateCodeModal.title")}</h2>

      <strong className="lottery-duplicate-code-modal__code" dir="ltr">
        {code}
      </strong>

      <p className="lottery-duplicate-code-modal__message">{t("lottery.duplicateCodeModal.message")}</p>

      <div className="lottery-duplicate-code-modal__actions">
        <button
          autoFocus
          className="lottery-duplicate-code-modal__button lottery-duplicate-code-modal__button--cancel"
          type="button"
          onClick={onCancel}
        >
          {t("lottery.duplicateCodeModal.cancel")}
        </button>
        <button
          className="lottery-duplicate-code-modal__button lottery-duplicate-code-modal__button--confirm"
          type="button"
          onClick={onConfirm}
        >
          {t("lottery.duplicateCodeModal.confirm")}
        </button>
      </div>
    </Modal>
  );
}
