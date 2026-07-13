import { useId } from "react";

import { useTranslation } from "react-i18next";

import { type UserPrize } from "@/entities/prizes";
import { getLocalizedMetadataString } from "@/shared/lib/i18n";

import { MyPrizeOutcomeLabel } from "./my-prize-outcome-label";

type MyPrizeDetailsProps = {
  prize: UserPrize;
};

export function MyPrizeDetails({ prize }: MyPrizeDetailsProps) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const description = getLocalizedMetadataString(prize.prizeData, locale, prize.prizeData.description);
  const titleId = useId();

  return (
    <section className="my-prizes-modal__details" aria-labelledby={titleId}>
      <div className="my-prizes-modal__details-head">
        <span className="my-prizes-modal__details-code" dir="ltr">
          {prize.promoCode ?? t("myPrizes.noPromoCode")}
        </span>

        {prize.outcome ? <MyPrizeOutcomeLabel outcome={prize.outcome} /> : null}
      </div>

      <h3 id={titleId} className="my-prizes-modal__details-title">
        {t("myPrizes.descriptionTitle")}
      </h3>

      <p className="my-prizes-modal__details-text">
        {description ?? t("myPrizes.noDescription")}
      </p>
    </section>
  );
}
