import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { useLuckyMeadowStore } from "../../model/lucky-meadow-store";
import { type LuckyMeadowOpenCellResult } from "../../model/types";
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
type LuckyMeadowSceneProps = {
  audioToggle?: ReactNode;
  canShowStartButton?: boolean;
  isGameOverAudioEnabled?: boolean;
  isStartPending?: boolean;
  onGameFinished?: (result: LuckyMeadowOpenCellResult) => void;
  onGameOverAudioEnd?: () => void;
  onGameOverAudioStart?: () => void;
  onOpenCell: (cellIndex: number) => Promise<LuckyMeadowOpenCellResult | null>;
  onStartGame: () => Promise<boolean>;
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
const GAME_OVER_PRESENTATION_DELAY_MS = 2300;

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
  canShowStartButton = true,
  isGameOverAudioEnabled = true,
  isStartPending = false,
  onGameFinished,
  onGameOverAudioEnd,
  onGameOverAudioStart,
  onOpenCell,
  onStartGame
}: LuckyMeadowSceneProps) => {
  const { t } = useTranslation();
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const jackpotMeterIconRef = useRef<HTMLImageElement | null>(null);
  const luckyMeterIconRef = useRef<HTMLImageElement | null>(null);
  const finishGameTimeoutRef = useRef<number | null>(null);
  const isStartingGameRef = useRef(false);
  const rewardFlyEffectIdRef = useRef(0);
  const isGameActive = useLuckyMeadowStore((state) => state.isGameActive);
  const openedCells = useLuckyMeadowStore((state) => state.openedCells);
  const openingCellIndex = useLuckyMeadowStore((state) => state.openingCellIndex);
  const cancelOpeningCell = useLuckyMeadowStore((state) => state.cancelOpeningCell);
  const startOpeningCell = useLuckyMeadowStore((state) => state.startOpeningCell);
  const openCell = useLuckyMeadowStore((state) => state.openCell);
  const finishGame = useLuckyMeadowStore((state) => state.finishGame);
  const startGame = useLuckyMeadowStore((state) => state.startGame);
  const closedCells = useMemo(() => {
    return getRandomClosedCellImages(PANEL_CELL_COUNT);
  }, []);
  const [jackpotBurstAnimationKey, setJackpotBurstAnimationKey] = useState(0);
  const [isFinishingGame, setIsFinishingGame] = useState(false);
  const [prizeStripesAnimationKey, setPrizeStripesAnimationKey] = useState(0);
  const [rewardFlyEffects, setRewardFlyEffects] = useState<LuckyMeadowRewardFlyEffectState[]>([]);
  const [skullEffect, setSkullEffect] = useState<LuckyMeadowSkullEffectState | null>(null);
  const areCellsLocked = !isGameActive || openingCellIndex !== null || isFinishingGame;
  const openedOutcomes = Object.values(openedCells);
  const luckyCount = Math.min(
    openedOutcomes.filter((openedOutcome) => openedOutcome === "lucky").length,
    REWARD_TARGET_COUNT
  );
  const jackpotCount = Math.min(
    openedOutcomes.filter((openedOutcome) => openedOutcome === "jackpot").length,
    REWARD_TARGET_COUNT
  );

  function triggerJackpotBurst() {
    setJackpotBurstAnimationKey((currentKey) => currentKey + 1);
  }

  function triggerPrizeStripes() {
    setPrizeStripesAnimationKey((currentKey) => currentKey + 1);
  }

  function clearFinishGameTimeout() {
    if (finishGameTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(finishGameTimeoutRef.current);
    finishGameTimeoutRef.current = null;
  }

  function completeGame(result: LuckyMeadowOpenCellResult) {
    clearFinishGameTimeout();
    setIsFinishingGame(false);
    finishGame();
    onGameFinished?.(result);
  }

  function scheduleGameFinish(result: LuckyMeadowOpenCellResult) {
    setIsFinishingGame(true);

    if (!result.prize && result.outcome === "skull") {
      finishGameTimeoutRef.current = window.setTimeout(() => {
        completeGame(result);
      }, GAME_OVER_PRESENTATION_DELAY_MS);

      return;
    }

    completeGame(result);
  }

  useEffect(() => {
    return () => {
      if (finishGameTimeoutRef.current !== null) {
        window.clearTimeout(finishGameTimeoutRef.current);
      }
    };
  }, []);

  async function handleStartButtonClick() {
    if (isStartPending || isStartingGameRef.current) {
      return;
    }

    isStartingGameRef.current = true;

    try {
      const didStartGame = await onStartGame();

      if (!didStartGame) {
        return;
      }

      startGame();
      setIsFinishingGame(false);
    } finally {
      isStartingGameRef.current = false;
    }
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
    let result: LuckyMeadowOpenCellResult | null = null;

    try {
      result = await onOpenCell(cellIndex);
    } catch {
      result = null;
    }

    if (!result) {
      cancelOpeningCell(cellIndex);
      return;
    }

    const outcome = result.outcome;
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

    if (didOpenCell && result.prize === "lucky") {
      triggerPrizeStripes();
    }

    if (didOpenCell && result.prize === "jackpot") {
      triggerJackpotBurst();
    }

    if (didOpenCell && result.status === "finished") {
      scheduleGameFinish(result);
    }
  }

  return (
    <div className="lucky-meadow-scene" style={luckyMeadowSceneStyle}>
      <audio ref={gameOverAudioRef} src={GAME_OVER_AUDIO_SRC} preload="none" onEnded={onGameOverAudioEnd} />

      <div className="lucky-meadow-scene__hud">
        <div
          className="lucky-meadow-scene__meter"
          aria-label={`Lucky prizes ${luckyCount} of ${REWARD_TARGET_COUNT}`}
        >
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
      {!isGameActive && canShowStartButton && (
        <button
          className="lucky-meadow-scene__start-button"
          type="button"
          disabled={isStartPending}
          onClick={() => void handleStartButtonClick()}
        >
          {isStartPending ? t("luckyMeadow.starting") : t("luckyMeadow.start")}
        </button>
      )}
      {audioToggle}
    </div>
  );
};
