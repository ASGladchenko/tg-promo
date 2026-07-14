import { useTranslation } from "react-i18next";

import { type LotteryAttemptPrize } from "@/entities/lottery";
import { Modal } from "@/shared/ui/modal";

import { getLotteryPrizeDetails } from "../../lib/get-lottery-prize-details";

import "./lottery-prize-result-modal.scss";

type LotteryPrizeResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prize?: LotteryAttemptPrize;
};

export function LotteryPrizeResultModal({ isOpen, onClose, prize }: LotteryPrizeResultModalProps) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { description, promoCode } = getLotteryPrizeDetails(prize, locale);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("lottery.prizeModal.label")}
      className="lottery-prize-result-modal"
    >
      <div className="lottery-prize-result-modal__header">
        <div>
          <p className="lottery-prize-result-modal__eyebrow">{t("lottery.prizeModal.eyebrow")}</p>
          <h2 className="lottery-prize-result-modal__title">{t("lottery.results.semiJackpot")}</h2>
        </div>

        <button
          autoFocus
          className="lottery-prize-result-modal__close"
          type="button"
          aria-label={t("lottery.prizeModal.close")}
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="lottery-prize-result-modal__result">
        <strong className="lottery-prize-result-modal__code">
          {promoCode ?? t("lottery.prizeModal.noDetails")}
        </strong>
        {description ? (
          <p className="lottery-prize-result-modal__description">{description}</p>
        ) : null}
      </div>
    </Modal>
  );
}
