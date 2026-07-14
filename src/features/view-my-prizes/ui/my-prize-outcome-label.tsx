import { useTranslation } from "react-i18next";

import { type UserPrizeOutcome } from "@/entities/prizes";

type MyPrizeOutcomeLabelProps = {
  outcome: UserPrizeOutcome;
};

export function MyPrizeOutcomeLabel({ outcome }: MyPrizeOutcomeLabelProps) {
  const { t } = useTranslation();
  const label = t(`myPrizes.outcomes.${outcome}`);

  return <span className="my-prizes-modal__outcome">{label}</span>;
}
