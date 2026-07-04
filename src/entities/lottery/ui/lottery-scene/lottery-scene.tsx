import {
  type AnimationEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import safeDoorBackfaceImage from "@/shared/images/back_face_safe.webp";
import safeDoorImage from "@/shared/images/safe_door.webp";
import safeImage from "@/shared/images/safe.webp";
import MuteIcon from "@/shared/svg/mute.svg?react";
import VolumeIcon from "@/shared/svg/volume.svg?react";

import { useLotteryStore } from "../../model/lottery-store";
import { SafeWheel } from "../safe-wheel";

import "./lottery-scene.scss";

type LotterySceneProps = {
  codePanel: ReactNode;
  doorState?: LotterySceneDoorState;
  isDoorDisabled?: boolean;
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

const LOOP_AUDIO_SRC = "/audio/16s.ogg";

const AUDIO_START_EVENTS = ["pointerdown", "click", "touchstart", "keydown"] as const;

function waitForImageReady(image: HTMLImageElement) {
  const decodeImage = () =>
    typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();

  if (image.complete && image.naturalWidth > 0) {
    return decodeImage();
  }

  return new Promise<void>((resolve) => {
    const handleLoad = () => {
      void decodeImage().finally(resolve);
    };

    const handleError = () => {
      resolve();
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });
}

export function LotteryScene({
  codePanel,
  doorState = "idle",
  isDoorDisabled = false,
  onAssetsReady,
  onDoorAnimationEnd,
  safeContent
}: LotterySceneProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sceneRef = useRef<HTMLElement | null>(null);
  const shouldResumeAudioRef = useRef(false);
  const hasReportedReadyRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isCodeLocked = useLotteryStore((state) => state.isCodeLocked);
  const openCodePicker = useLotteryStore((state) => state.openCodePicker);
  const isDoorInteractionDisabled = isCodeLocked || isDoorDisabled;

  async function playAudio(audio: HTMLAudioElement) {
    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const audioElement = audio;
    audioElement.volume = 0.01;

    function removeStartListeners() {
      AUDIO_START_EVENTS.forEach((eventName) => {
        document.removeEventListener(eventName, startAudioAfterInteraction);
      });
    }

    function startAudioAfterInteraction(event: Event) {
      const target = event.target;

      if (target instanceof Element && target.closest(".lottery-scene__audio-toggle")) {
        return;
      }

      void playAudio(audioElement).then((started) => {
        if (started) {
          removeStartListeners();
        }
      });
    }

    AUDIO_START_EVENTS.forEach((eventName) => {
      document.addEventListener(eventName, startAudioAfterInteraction);
    });

    function pauseAudioForBackground() {
      if (audioElement.paused) {
        return;
      }

      shouldResumeAudioRef.current = true;
      audioElement.pause();
      setIsPlaying(false);
    }

    function resumeAudioAfterBackground() {
      if (!shouldResumeAudioRef.current || document.visibilityState === "hidden") {
        return;
      }

      void playAudio(audioElement).then((started) => {
        if (started) {
          shouldResumeAudioRef.current = false;
        }
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        pauseAudioForBackground();
        return;
      }

      resumeAudioAfterBackground();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", pauseAudioForBackground);
    window.addEventListener("blur", pauseAudioForBackground);
    window.addEventListener("pageshow", resumeAudioAfterBackground);
    window.addEventListener("focus", resumeAudioAfterBackground);

    return () => {
      removeStartListeners();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", pauseAudioForBackground);
      window.removeEventListener("blur", pauseAudioForBackground);
      window.removeEventListener("pageshow", resumeAudioAfterBackground);
      window.removeEventListener("focus", resumeAudioAfterBackground);
      audioElement.pause();
    };
  }, []);

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

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      await playAudio(audio);
      return;
    }

    audio.pause();
    shouldResumeAudioRef.current = false;
    setIsPlaying(false);
  }

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
      <audio ref={audioRef} src={LOOP_AUDIO_SRC} loop preload="none" />
      <div className="lottery-scene__stage">
        <img
          className="lottery-scene__safe"
          src={safeImage}
          alt={t("lottery.safeAlt")}
          loading="eager"
          decoding="sync"
          draggable={false}
        />

        {safeContent ? <div className="lottery-scene__safe-content">{safeContent}</div> : null}

        <div
          className={clsx("lottery-scene__door-wrapper", {
            "lottery-scene__door-wrapper--locked": isDoorInteractionDisabled
          })}
          role="button"
          tabIndex={isDoorInteractionDisabled ? -1 : 0}
          aria-label={
            isDoorInteractionDisabled ? t("lottery.codeLocked") : t("lottery.openCodePicker")
          }
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

      <button
        className="lottery-scene__audio-toggle"
        type="button"
        onClick={() => void toggleAudio()}
        aria-label={isPlaying ? t("lottery.soundOff") : t("lottery.soundOn")}
        title={isPlaying ? t("lottery.soundOff") : t("lottery.soundOn")}
      >
        {isPlaying ? (
          <VolumeIcon className="lottery-scene__audio-icon" aria-hidden="true" focusable="false" />
        ) : (
          <MuteIcon className="lottery-scene__audio-icon" aria-hidden="true" focusable="false" />
        )}
      </button>
    </section>
  );
}
