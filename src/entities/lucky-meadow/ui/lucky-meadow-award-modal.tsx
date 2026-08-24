import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { getLocalizedMetadataString } from "@/shared/lib/i18n";
import { Modal } from "@/shared/ui/modal";

import { useLuckyMeadowAwardModalStore } from "../model/use-lucky-meadow-award-modal-store";

import "./lucky-meadow-award-modal.scss";

export function LuckyMeadowAwardModal() {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const isOpen = useLuckyMeadowAwardModalStore((state) => state.isOpen);
  const onClose = useLuckyMeadowAwardModalStore((state) => state.close);
  const prize = useLuckyMeadowAwardModalStore((state) => state.prize);
  const outcome = prize?.outcome ?? "lucky";
  const description = getLocalizedMetadataString(prize?.prizeData, locale, prize?.prizeData.description);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("luckyMeadow.awardModal.label")}
      className={clsx("lucky-meadow-award-modal", {
        "lucky-meadow-award-modal--jackpot": outcome === "jackpot",
        "lucky-meadow-award-modal--lucky": outcome === "lucky"
      })}
    >
      <div className="lucky-meadow-award-modal__header">
        <div>
          <p className="lucky-meadow-award-modal__eyebrow">
            {t(`luckyMeadow.awardModal.${outcome}.eyebrow`)}
          </p>
          <h2 className="lucky-meadow-award-modal__title">
            {t(`luckyMeadow.awardModal.${outcome}.title`)}
          </h2>
        </div>

        <button
          autoFocus
          className="lucky-meadow-award-modal__close"
          type="button"
          aria-label={t("luckyMeadow.awardModal.close")}
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="lucky-meadow-award-modal__result">
        <strong className="lucky-meadow-award-modal__code">
          {prize?.promoCode ?? t("myPrizes.noPromoCode")}
        </strong>
        <p className="lucky-meadow-award-modal__description">
          {description ?? t("myPrizes.noDescription")}
        </p>
      </div>
    </Modal>
  );
}
