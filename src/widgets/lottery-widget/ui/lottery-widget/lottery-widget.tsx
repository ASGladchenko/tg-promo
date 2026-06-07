import { lazy, Suspense, useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { LotteryWidgetLoader } from "../lottery-widget-loader";

import "./lottery-widget.scss";

const LazyLotteryWidgetScene = lazy(() =>
  import("../lottery-widget-scene").then(({ LotteryWidgetScene }) => ({
    default: LotteryWidgetScene
  }))
);

export function LotteryWidget() {
  const { t } = useTranslation();
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isSceneVisible, setIsSceneVisible] = useState(false);

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

  return (
    <section className="lottery-widget" aria-label={t("lottery.widgetLabel")}>
      <div
        className={
          isSceneVisible ? "lottery-widget__scene lottery-widget__scene--visible" : "lottery-widget__scene"
        }
      >
        <Suspense fallback={null}>
          <LazyLotteryWidgetScene onAssetsReady={handleAssetsReady} />
        </Suspense>
      </div>

      <div
        className={
          isSceneVisible
            ? "lottery-widget__loader-overlay lottery-widget__loader-overlay--hidden"
            : "lottery-widget__loader-overlay"
        }
        aria-hidden={isSceneVisible}
      >
        <LotteryWidgetLoader />
      </div>
    </section>
  );
}
