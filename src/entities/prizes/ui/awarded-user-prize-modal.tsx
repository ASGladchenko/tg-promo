import { useTranslation } from "react-i18next";

import { getLocalizedMetadataString } from "@/shared/lib/i18n";
import { Modal } from "@/shared/ui/modal";

import { useConsolationModalStore } from "../model/use-consolation-modal-store";

import "./awarded-user-prize-modal.scss";

export function AwardedUserPrizeModal() {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const isOpen = useConsolationModalStore((state) => state.isOpen);
  const onClose = useConsolationModalStore((state) => state.close);
  const prize = useConsolationModalStore((state) => state.prize);

  const description = getLocalizedMetadataString(prize?.prizeData, locale, prize?.prizeData.description);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("myPrizes.awardedModal.label")}
      className="awarded-user-prize-modal"
    >
      <div className="awarded-user-prize-modal__header">
        <div>
          <p className="awarded-user-prize-modal__eyebrow">{t("myPrizes.awardedModal.eyebrow")}</p>
          <h2 className="awarded-user-prize-modal__title">{t("myPrizes.awardedModal.title")}</h2>
        </div>

        <button
          autoFocus
          className="awarded-user-prize-modal__close"
          type="button"
          aria-label={t("myPrizes.awardedModal.close")}
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="awarded-user-prize-modal__result">
        <strong className="awarded-user-prize-modal__code">
          {prize?.promoCode ?? t("myPrizes.noPromoCode")}
        </strong>
        <p className="awarded-user-prize-modal__description">{description ?? t("myPrizes.noDescription")}</p>
      </div>
    </Modal>
  );
}
