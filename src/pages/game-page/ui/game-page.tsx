import { lazy, Suspense, type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { GameScheduleId, useActiveGameSchedule } from "@/entities/game-schedule";
import { GameUnavailablePlaceholder } from "@/shared/ui/game-unavailable-placeholder";

import { GamePageLoader } from "./game-page-loader";

import "./game-page.scss";

const LazyLotteryWidget = lazy(() =>
  import("@/widgets/lottery-widget").then(({ LotteryWidget }) => ({ default: LotteryWidget }))
);
const LazyLuckyMeadowWidget = lazy(() =>
  import("@/widgets/lucky-meadow-widget").then(({ LuckyMeadowWidget }) => ({ default: LuckyMeadowWidget }))
);

export function GamePage() {
  const { t } = useTranslation();
  const activeGameScheduleQuery = useActiveGameSchedule();

  let content: ReactNode;

  if (activeGameScheduleQuery.isLoading) {
    content = <GamePageLoader />;
  } else if (activeGameScheduleQuery.isError) {
    content = (
      <GameUnavailablePlaceholder
        ariaLabel={t("game.unavailableLabel")}
        message={t("game.errors.activeSchedule")}
      />
    );
  } else if (activeGameScheduleQuery.data?.gameId === GameScheduleId.CrackSafe) {
    content = (
      <Suspense fallback={<GamePageLoader />}>
        <LazyLotteryWidget />
      </Suspense>
    );
  } else if (activeGameScheduleQuery.data?.gameId === GameScheduleId.LuckyMeadow) {
    content = (
      <Suspense fallback={<GamePageLoader />}>
        <LazyLuckyMeadowWidget />
      </Suspense>
    );
  } else {
    content = (
      <GameUnavailablePlaceholder
        ariaLabel={t("game.unavailableLabel")}
        message={t("game.unavailableMessage")}
      />
    );
  }

  return (
    <section className="game-page" aria-label={t("game.pageLabel")}>
      {content}
    </section>
  );
}
