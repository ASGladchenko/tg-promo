import { useId } from "react";

import { useTranslation } from "react-i18next";

import { type UserPrize } from "@/entities/prizes";

import { MyPrizeOutcomeLabel } from "./my-prize-outcome-label";

type MyPrizeDetailsProps = {
  prize: UserPrize;
};

export function MyPrizeDetails({ prize }: MyPrizeDetailsProps) {
  const { t } = useTranslation();
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
        {prize.description ?? t("myPrizes.noDescription")}
      </p>
    </section>
  );
}
