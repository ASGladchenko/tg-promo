import { type AnimationEvent, type KeyboardEvent, type ReactNode, useEffect, useRef } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import safeDoorBackfaceImage from "@/shared/images/back_face_safe.webp";
import safeDoorImage from "@/shared/images/safe_door.webp";
import safeImage from "@/shared/images/safe.webp";

import { useLotteryStore } from "../../model/lottery-store";
import { SafeWheel } from "../safe-wheel";
import { waitForImageReady } from "./wait-for-image-ready";

import "./lottery-scene.scss";

type LotterySceneProps = {
  audioToggle?: ReactNode;
  codePanel: ReactNode;
  doorState?: LotterySceneDoorState;
  isDoorDisabled?: boolean;
  isDoorOpen?: boolean;
  onAssetsReady?: () => void;
  onDoorAnimationEnd?: (doorState: LotterySceneDoorState) => void;
  safeContent?: ReactNode;
};
export type LotterySceneDoorState =
  | "idle"
  | "jackpotOpen"
  | "jackpotReveal"
  | "losePeek"
  | "open"
  | "peekTwice";

export function LotteryScene({
  audioToggle,
  codePanel,
  doorState = "idle",
  isDoorDisabled = false,
  isDoorOpen,
  onAssetsReady,
  onDoorAnimationEnd,
  safeContent
}: LotterySceneProps) {
  const { t } = useTranslation();
  const sceneRef = useRef<HTMLElement | null>(null);
  const hasReportedReadyRef = useRef(false);
  const isCodeLocked = useLotteryStore((state) => state.isCodeLocked);
  const openCodePicker = useLotteryStore((state) => state.openCodePicker);
  const isDoorInteractionDisabled = isCodeLocked || isDoorDisabled;

  useEffect(() => {
    if (!onAssetsReady || hasReportedReadyRef.current) {
      return;
    }

    const sceneNode = sceneRef.current;
    if (!sceneNode) {
      onAssetsReady();
      hasReportedReadyRef.current = true;
      return;
    }

    let isCancelled = false;
    const images = Array.from(sceneNode.querySelectorAll("img"));

    Promise.all(images.map((image) => waitForImageReady(image))).finally(() => {
      if (isCancelled || hasReportedReadyRef.current) {
        return;
      }

      hasReportedReadyRef.current = true;
      onAssetsReady();
    });

    return () => {
      isCancelled = true;
    };
  }, [onAssetsReady]);

  function triggerDoorHapticFeedback() {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
  }

  function openCodePickerFromDoor() {
    if (isDoorInteractionDisabled) {
      return;
    }

    const didOpen = openCodePicker(0);

    if (didOpen) {
      triggerDoorHapticFeedback();
    }
  }

  function handleDoorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openCodePickerFromDoor();
  }

  function handleDoorAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.currentTarget !== event.target || doorState === "idle") {
      return;
    }

    onDoorAnimationEnd?.(doorState);
  }

  return (
    <section ref={sceneRef} className="lottery-scene" aria-label={t("lottery.sceneLabel")}>
      <div className="lottery-scene__stage">
        <img
          className="lottery-scene__safe"
          src={safeImage}
          alt={t("lottery.safeAlt")}
          loading="eager"
          decoding="sync"
          draggable={false}
        />

        {safeContent ? (
          <div
            className={clsx("lottery-scene__safe-content", {
              clickable: isDoorOpen
            })}
          >
            {safeContent}
          </div>
        ) : null}

        <div
          className={clsx("lottery-scene__door-wrapper", {
            "lottery-scene__door-wrapper--locked": isDoorInteractionDisabled
          })}
          role="button"
          tabIndex={isDoorInteractionDisabled ? -1 : 0}
          aria-label={isDoorInteractionDisabled ? t("lottery.codeLocked") : t("lottery.openCodePicker")}
          aria-disabled={isDoorInteractionDisabled}
          onClick={openCodePickerFromDoor}
          onKeyDown={handleDoorKeyDown}
        >
          <div
            className={clsx("lottery-scene__door-panel", {
              "lottery-scene__door-panel--jackpot-open": doorState === "jackpotOpen",
              "lottery-scene__door-panel--jackpot-reveal": doorState === "jackpotReveal",
              "lottery-scene__door-panel--lose-peek": doorState === "losePeek",
              "lottery-scene__door-panel--open": doorState === "open",
              "lottery-scene__door-panel--peek-twice": doorState === "peekTwice"
            })}
            onAnimationEnd={handleDoorAnimationEnd}
          >
            <img
              className="lottery-scene__door lottery-scene__door--backface"
              src={safeDoorBackfaceImage}
              alt={t("lottery.safeDoorAlt")}
              loading="eager"
              decoding="sync"
              draggable={false}
            />

            <img
              className="lottery-scene__door"
              src={safeDoorImage}
              alt={t("lottery.safeDoorAlt")}
              loading="eager"
              decoding="sync"
              draggable={false}
            />

            <SafeWheel />
          </div>
        </div>
      </div>

      {codePanel}

      {audioToggle}
    </section>
  );
}
