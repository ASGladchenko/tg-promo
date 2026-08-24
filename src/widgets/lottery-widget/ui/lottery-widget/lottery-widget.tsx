import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useLotteryAvailability } from "@/entities/lottery";
import { GameUnavailablePlaceholder } from "@/shared/ui/game-unavailable-placeholder";

import { LotteryWidgetLoader } from "../lottery-widget-loader";

import "./lottery-widget.scss";

const LazyLotteryWidgetScene = lazy(() =>
  import("../lottery-widget-scene").then(({ LotteryWidgetScene }) => ({
    default: LotteryWidgetScene
  }))
);

const PREPARING_NEW_SAFE_AVAILABILITY_MESSAGE = "Preparing a new safe. Wait for the notification";
const EMPTY_ENTERED_CODES: string[] = [];

export function LotteryWidget() {
  const { t } = useTranslation();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isSceneVisible, setIsSceneVisible] = useState(false);

  const { isLoading, data } = useLotteryAvailability();

  const isSceneAvailable = isSceneVisible && !isLoading;
  const isGameUnavailable = data !== undefined && !data.isAvailable && !data.prize;
  const unavailableMessage =
    data?.message === PREPARING_NEW_SAFE_AVAILABILITY_MESSAGE
      ? t("lottery.availability.preparingNewSafe")
      : t("lottery.availability.fallback");

  const handleAssetsReady = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  useEffect(() => {
    if (!isSceneReady) {
      return;
    }

    let secondFrameId: number | undefined;
    const firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        setIsSceneVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId !== undefined) {
        window.cancelAnimationFrame(secondFrameId);
      }
    };
  }, [isSceneReady]);

  if (isGameUnavailable) {
    return (
      <GameUnavailablePlaceholder
        ariaLabel={t("lottery.widgetLabel")}
        message={unavailableMessage}
      />
    );
  }

  return (
    <section className="lottery-widget" aria-label={t("lottery.widgetLabel")}>
      <div
        className={clsx("lottery-widget__scene", {
          "lottery-widget__scene--visible": isSceneAvailable
        })}
      >
        <Suspense fallback={null}>
          <LazyLotteryWidgetScene
            enteredCodes={data?.enteredCodes ?? EMPTY_ENTERED_CODES}
            initialPrize={data?.prize}
            onAssetsReady={handleAssetsReady}
          />
        </Suspense>
      </div>

      <div
        className={clsx("lottery-widget__loader-overlay", {
          "lottery-widget__loader-overlay--hidden": isSceneAvailable
        })}
        aria-hidden={isSceneAvailable}
      >
        <LotteryWidgetLoader />
      </div>
    </section>
  );
}
