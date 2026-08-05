import { type CSSProperties, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { useLuckyMeadowStore } from "../../model/lucky-meadow-store";
import { mockOpenLuckyMeadowCell } from "../../model/mock-open-lucky-meadow-cell";
import {
  createLuckyMeadowSkullEffect,
  type LuckyMeadowSkullEffectState
} from "./create-lucky-meadow-skull-effect";
import { getRandomClosedCellImages } from "./get-random-closed-cell-images";
import { LuckyMeadowJackpotBurst } from "./lucky-meadow-jackpot-burst";
import { LuckyMeadowPanelCell } from "./lucky-meadow-panel-cell";
import { LuckyMeadowPrizeStripes } from "./lucky-meadow-prize-stripes";
import { luckyMeadowBgImage, luckyMeadowOpenedCellImages } from "./lucky-meadow-scene-assets";
import { LuckyMeadowSkullEffect } from "./lucky-meadow-skull-effect";

import "./lucky-meadow-scene.scss";

type LuckyMeadowSceneStyle = CSSProperties & {
  "--lucky-meadow-bg": string;
};
type LuckyMeadowRewardFlyEffectStyle = CSSProperties & {
  "--reward-end-x": string;
  "--reward-end-y": string;
  "--reward-start-size": string;
  "--reward-start-x": string;
  "--reward-start-y": string;
};
type LuckyMeadowSceneAnimationTrigger = () => void;
type LuckyMeadowSceneProps = {
  audioToggle?: ReactNode;
  isGameOverAudioEnabled?: boolean;
  onGameOverAudioEnd?: () => void;
  onGameOverAudioStart?: () => void;
  onJackpotBurstTriggerReady?: (triggerJackpotBurst: LuckyMeadowSceneAnimationTrigger) => void;
  onPrizeStripesTriggerReady?: (triggerPrizeStripes: LuckyMeadowSceneAnimationTrigger) => void;
};
type LuckyMeadowRewardOutcome = "jackpot" | "lucky";
type LuckyMeadowRewardFlyEffectState = {
  endX: number;
  endY: number;
  id: number;
  outcome: LuckyMeadowRewardOutcome;
  size: number;
  startX: number;
  startY: number;
};

const PANEL_CELL_COUNT = 24;
const REWARD_TARGET_COUNT = 2;

const GAME_OVER_AUDIO_SRC = "/audio/lucky-meadow-game-over.ogg";

const luckyMeadowSceneStyle: LuckyMeadowSceneStyle = {
  "--lucky-meadow-bg": `url(${luckyMeadowBgImage})`
};

async function playGameOverAudio(audio: HTMLAudioElement | null) {
  if (!audio) {
    return false;
  }

  audio.currentTime = 0;

  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

function getLuckyMeadowRewardFlyEffectStyle(
  effect: LuckyMeadowRewardFlyEffectState
): LuckyMeadowRewardFlyEffectStyle {
  return {
    "--reward-end-x": `${effect.endX}px`,
    "--reward-end-y": `${effect.endY}px`,
    "--reward-start-size": `${effect.size}px`,
    "--reward-start-x": `${effect.startX}px`,
    "--reward-start-y": `${effect.startY}px`
  };
}

export const LuckyMeadowScene = ({
  audioToggle,
  isGameOverAudioEnabled = true,
  onJackpotBurstTriggerReady,
  onGameOverAudioEnd,
  onGameOverAudioStart,
  onPrizeStripesTriggerReady
}: LuckyMeadowSceneProps) => {
  const { t } = useTranslation();
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const jackpotMeterIconRef = useRef<HTMLImageElement | null>(null);
  const luckyMeterIconRef = useRef<HTMLImageElement | null>(null);
  const rewardFlyEffectIdRef = useRef(0);
  const isGameActive = useLuckyMeadowStore((state) => state.isGameActive);
  const openedCells = useLuckyMeadowStore((state) => state.openedCells);
  const openingCellIndex = useLuckyMeadowStore((state) => state.openingCellIndex);
  const startOpeningCell = useLuckyMeadowStore((state) => state.startOpeningCell);
  const openCell = useLuckyMeadowStore((state) => state.openCell);
  const startGame = useLuckyMeadowStore((state) => state.startGame);
  const closedCells = useMemo(() => {
    return getRandomClosedCellImages(PANEL_CELL_COUNT);
  }, []);
  const [jackpotBurstAnimationKey, setJackpotBurstAnimationKey] = useState(0);
  const [prizeStripesAnimationKey, setPrizeStripesAnimationKey] = useState(0);
  const [rewardFlyEffects, setRewardFlyEffects] = useState<LuckyMeadowRewardFlyEffectState[]>([]);
  const [skullEffect, setSkullEffect] = useState<LuckyMeadowSkullEffectState | null>(null);
  const areCellsLocked = !isGameActive || openingCellIndex !== null;
  const openedOutcomes = Object.values(openedCells);
  const luckyCount = Math.min(
    openedOutcomes.filter((openedOutcome) => openedOutcome === "lucky").length,
    REWARD_TARGET_COUNT
  );
  const jackpotCount = Math.min(
    openedOutcomes.filter((openedOutcome) => openedOutcome === "jackpot").length,
    REWARD_TARGET_COUNT
  );

  const triggerJackpotBurst = useCallback(() => {
    setJackpotBurstAnimationKey((currentKey) => currentKey + 1);
  }, []);

  const triggerPrizeStripes = useCallback(() => {
    setPrizeStripesAnimationKey((currentKey) => currentKey + 1);
  }, []);

  useEffect(() => {
    onJackpotBurstTriggerReady?.(triggerJackpotBurst);
  }, [onJackpotBurstTriggerReady, triggerJackpotBurst]);

  useEffect(() => {
    onPrizeStripesTriggerReady?.(triggerPrizeStripes);
  }, [onPrizeStripesTriggerReady, triggerPrizeStripes]);

  function handleStartButtonClick() {
    startGame();
  }

  function addRewardFlyEffect(outcome: LuckyMeadowRewardOutcome, cellRect: DOMRect, targetRect: DOMRect) {
    rewardFlyEffectIdRef.current += 1;

    setRewardFlyEffects((currentEffects) => [
      ...currentEffects,
      {
        endX: targetRect.left + targetRect.width / 2,
        endY: targetRect.top + targetRect.height / 2,
        id: rewardFlyEffectIdRef.current,
        outcome,
        size: cellRect.width,
        startX: cellRect.left + cellRect.width / 2,
        startY: cellRect.top + cellRect.height / 2
      }
    ]);
  }

  async function handleCellClick(cellIndex: number, cellElement: HTMLButtonElement) {
    const didStartOpening = startOpeningCell(cellIndex);

    if (!didStartOpening) {
      return;
    }

    const cellRect = cellElement.getBoundingClientRect();
    const outcome = await mockOpenLuckyMeadowCell();
    const didOpenCell = openCell(cellIndex, outcome);

    if (didOpenCell && (outcome === "lucky" || outcome === "jackpot")) {
      const targetElement = outcome === "lucky" ? luckyMeterIconRef.current : jackpotMeterIconRef.current;

      if (targetElement) {
        addRewardFlyEffect(outcome, cellRect, targetElement.getBoundingClientRect());
      }
    }

    if (didOpenCell && outcome === "skull") {
      if (isGameOverAudioEnabled) {
        onGameOverAudioStart?.();

        void playGameOverAudio(gameOverAudioRef.current).then((didStartAudio) => {
          if (!didStartAudio) {
            onGameOverAudioEnd?.();
          }
        });
      }

      setSkullEffect(createLuckyMeadowSkullEffect(cellRect));
    }
  }

  return (
    <div className="lucky-meadow-scene" style={luckyMeadowSceneStyle}>
      <audio ref={gameOverAudioRef} src={GAME_OVER_AUDIO_SRC} preload="none" onEnded={onGameOverAudioEnd} />

      <div className="lucky-meadow-scene__hud">
        <div className="lucky-meadow-scene__meter" aria-label={`Lucky prizes ${luckyCount} of ${REWARD_TARGET_COUNT}`}>
          <span className="lucky-meadow-scene__meter-count">
            {luckyCount}/{REWARD_TARGET_COUNT}
          </span>
          <img
            ref={luckyMeterIconRef}
            className="lucky-meadow-scene__meter-icon"
            src={luckyMeadowOpenedCellImages.lucky}
            alt=""
          />
        </div>
        <div
          className="lucky-meadow-scene__meter"
          aria-label={`Jackpot prizes ${jackpotCount} of ${REWARD_TARGET_COUNT}`}
        >
          <span className="lucky-meadow-scene__meter-count">
            {jackpotCount}/{REWARD_TARGET_COUNT}
          </span>
          <img
            ref={jackpotMeterIconRef}
            className="lucky-meadow-scene__meter-icon"
            src={luckyMeadowOpenedCellImages.jackpot}
            alt=""
          />
        </div>
      </div>

      <div className="lucky-meadow-scene__panel-wrapper">
        {closedCells.map((image, index) => {
          const openedOutcome = openedCells[index];

          return (
            <LuckyMeadowPanelCell
              key={index}
              cellIndex={index}
              closedImage={image}
              isLocked={areCellsLocked}
              isOpening={openingCellIndex === index}
              openedOutcome={openedOutcome}
              onOpen={handleCellClick}
            />
          );
        })}
        {prizeStripesAnimationKey > 0 && <LuckyMeadowPrizeStripes key={prizeStripesAnimationKey} />}
        {jackpotBurstAnimationKey > 0 && <LuckyMeadowJackpotBurst key={jackpotBurstAnimationKey} />}
      </div>
      {skullEffect && (
        <LuckyMeadowSkullEffect
          key={skullEffect.id}
          effect={skullEffect}
          onAnimationEnd={() => {
            setSkullEffect(null);
          }}
        />
      )}
      {rewardFlyEffects.map((effect) => (
        <img
          className="lucky-meadow-scene__reward-fly"
          key={effect.id}
          src={luckyMeadowOpenedCellImages[effect.outcome]}
          alt=""
          aria-hidden="true"
          style={getLuckyMeadowRewardFlyEffectStyle(effect)}
          onAnimationEnd={() => {
            setRewardFlyEffects((currentEffects) =>
              currentEffects.filter((currentEffect) => currentEffect.id !== effect.id)
            );
          }}
        />
      ))}
      {!isGameActive && (
        <button className="lucky-meadow-scene__start-button" type="button" onClick={handleStartButtonClick}>
          {t("luckyMeadow.start")}
        </button>
      )}
      {audioToggle}
    </div>
  );
};
