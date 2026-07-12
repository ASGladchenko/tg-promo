import { useTranslation } from "react-i18next";

import { type UserPrizeOutcome } from "@/entities/prizes";

type MyPrizeOutcomeLabelProps = {
  outcome: UserPrizeOutcome;
};

export function MyPrizeOutcomeLabel({ outcome }: MyPrizeOutcomeLabelProps) {
  const { t } = useTranslation();
  const label =
    outcome === "jackpot" ? t("myPrizes.outcomes.jackpot") : t("myPrizes.outcomes.semiJackpot");

  return <span className="my-prizes-modal__outcome">{label}</span>;
}
