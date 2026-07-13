import { type ReactNode } from "react";

import { type TFunction } from "i18next";

import { type UserPrize } from "@/entities/prizes";
import { CircularProgressLoader } from "@/shared/ui/circular-progress-loader";

import { MyPrizeDetails } from "./my-prize-details";
import { MyPrizeRow } from "./my-prize-row";

type MyPrizesModalBodyContentParams = {
  isError: boolean;
  isLoading: boolean;
  onPrizeInfoClick: (prize: UserPrize) => void;
  prizes: UserPrize[];
  selectedPrize: UserPrize | null;
  t: TFunction;
  titleId: string;
};

export function getMyPrizesModalBodyContent({
  isError,
  isLoading,
  onPrizeInfoClick,
  prizes,
  selectedPrize,
  t,
  titleId,
}: MyPrizesModalBodyContentParams): ReactNode {
  switch (true) {
    case selectedPrize !== null:
      return <MyPrizeDetails prize={selectedPrize} />;
    case isLoading:
      return (
        <div
          className="my-prizes-modal__state my-prizes-modal__state--loading"
          role="status"
          aria-live="polite"
        >
          <CircularProgressLoader className="my-prizes-modal__loader" size={34} />
          <span>{t("myPrizes.loading")}</span>
        </div>
      );
    case isError:
      return (
        <p className="my-prizes-modal__state my-prizes-modal__state--error" role="alert">
          {t("myPrizes.error")}
        </p>
      );
    case prizes.length > 0:
      return (
        <ul className="my-prizes-modal__list" aria-labelledby={titleId}>
          {prizes.map((prize) => (
            <MyPrizeRow key={prize.id} prize={prize} onInfoClick={onPrizeInfoClick} />
          ))}
        </ul>
      );
    default:
      return (
        <p className="my-prizes-modal__state" role="status" aria-live="polite">
          {t("myPrizes.empty")}
        </p>
      );
  }
}
