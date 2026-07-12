import { useTranslation } from "react-i18next";

import { type UserPrize } from "@/entities/prizes";

import { formatMyPrizeDate } from "../lib/format-my-prize-date";
import { MyPrizeCopyButton } from "./my-prize-copy-button";
import { MyPrizeInfoButton } from "./my-prize-info-button";
import { MyPrizeOutcomeLabel } from "./my-prize-outcome-label";

type MyPrizeRowProps = {
  onInfoClick: (prize: UserPrize) => void;
  prize: UserPrize;
};

export function MyPrizeRow({ onInfoClick, prize }: MyPrizeRowProps) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const date = formatMyPrizeDate(prize.createdAt, locale);
  const prizeLabel = prize.promoCode ?? date;

  return (
    <li className="my-prizes-modal__row">
      {prize.outcome ? (
        <div className="my-prizes-modal__outcome-row">
          <MyPrizeOutcomeLabel outcome={prize.outcome} />
        </div>
      ) : null}

      <div className="my-prizes-modal__main">
        <span className="my-prizes-modal__promo" dir="ltr">
          {prize.promoCode ?? t("myPrizes.noPromoCode")}
        </span>

        {prize.promoCode ? <MyPrizeCopyButton promoCode={prize.promoCode} /> : null}
      </div>

      <div className="my-prizes-modal__meta">
        <time className="my-prizes-modal__date" dateTime={prize.createdAt}>
          {date}
        </time>

        <MyPrizeInfoButton label={prizeLabel} onClick={() => onInfoClick(prize)} />
      </div>
    </li>
  );
}
