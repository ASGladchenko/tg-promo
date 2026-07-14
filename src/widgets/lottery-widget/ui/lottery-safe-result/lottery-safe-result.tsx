import { useTranslation } from "react-i18next";

import { type LotteryAttemptPrize } from "@/entities/lottery";

import { getLotteryPrizeDetails } from "../../lib/get-lottery-prize-details";

import "./lottery-safe-result.scss";

type LotterySafeResultProps = {
  prize?: LotteryAttemptPrize;
};

export function LotterySafeResult({ prize }: LotterySafeResultProps) {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { description, promoCode } = getLotteryPrizeDetails(prize, locale);

  return (
    <div className="lottery-safe-result" aria-live="polite">
      <strong className="lottery-safe-result__title">{t("lottery.safeResult.jackpot")}</strong>
      <strong className="lottery-safe-result__code">
        {promoCode ?? t("lottery.prizeModal.noDetails")}
      </strong>
      {description ? <span className="lottery-safe-result__description">{description}</span> : null}
    </div>
  );
}
