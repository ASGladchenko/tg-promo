import { type CSSProperties, useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useAttemptsWallet } from "@/entities/attempts";
import { MineScene, type MineSceneZoneKind } from "@/entities/mine";
import mineGoldImage from "@/shared/images/miner/miner-gold-small.webp";
import mineRubyImage from "@/shared/images/miner/miner-ruby.webp";

import { useMineSessionGame } from "../../model/use-mine-session-game";
import { type MineSessionCountdownStep, type MineSessionStatus } from "../../model/types";

import "./mine-session.scss";

type MineSessionFlyEffect = {
  endX: number;
  endY: number;
  id: string;
  kind: MineSceneZoneKind;
  midX: number;
  midY: number;
  startX: number;
  startY: number;
};

type MineSessionPenaltyEffect = {
  id: string;
  penalty: number;
  x: number;
  y: number;
};

type MineSessionFlyEffectStyle = CSSProperties & {
  "--mine-session-fly-end-x": string;
  "--mine-session-fly-end-y": string;
  "--mine-session-fly-mid-x": string;
  "--mine-session-fly-mid-y": string;
  "--mine-session-fly-start-x": string;
  "--mine-session-fly-start-y": string;
};

type MineSessionPenaltyEffectStyle = CSSProperties & {
  "--mine-session-penalty-x": string;
  "--mine-session-penalty-y": string;
};

function formatMineSessionTime(seconds: number): string {
  return `00:${seconds.toString().padStart(2, "0")}`;
}

function getMineSessionCountdownLabel(
  countdownStep: MineSessionCountdownStep | null,
  goLabel: string
): string | null {
  if (countdownStep === null) {
    return null;
  }

  if (countdownStep === "go") {
    return goLabel;
  }

  return countdownStep;
}

function getMineSessionButtonLabel(status: MineSessionStatus, startLabel: string, restartLabel: string) {
  if (status === "finished") {
    return restartLabel;
  }

  return startLabel;
}

function getMineSessionFlyEffectStyle(effect: MineSessionFlyEffect): MineSessionFlyEffectStyle {
  return {
    "--mine-session-fly-end-x": `${effect.endX}px`,
    "--mine-session-fly-end-y": `${effect.endY}px`,
    "--mine-session-fly-mid-x": `${effect.midX}px`,
    "--mine-session-fly-mid-y": `${effect.midY}px`,
    "--mine-session-fly-start-x": `${effect.startX}px`,
    "--mine-session-fly-start-y": `${effect.startY}px`
  };
}

function getMineSessionFlyEffectImage(kind: MineSceneZoneKind): string {
  if (kind === "ruby") {
    return mineRubyImage;
  }

  return mineGoldImage;
}

function getMineSessionPenaltyEffectStyle(effect: MineSessionPenaltyEffect): MineSessionPenaltyEffectStyle {
  return {
    "--mine-session-penalty-x": `${effect.x}px`,
    "--mine-session-penalty-y": `${effect.y}px`
  };
}

export function MineSession() {
  const { t } = useTranslation();
  const { data: wallet } = useAttemptsWallet({ enabled: false });
  const counterRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [flyEffects, setFlyEffects] = useState<MineSessionFlyEffect[]>([]);
  const [penaltyEffects, setPenaltyEffects] = useState<MineSessionPenaltyEffect[]>([]);
  const {
    activeZones,
    collectEffect,
    collectedGold,
    countdownStep,
    handleMineCellClick,
    missEffect,
    startSession,
    status,
    timeLeftSeconds
  } = useMineSessionGame();
  const countdownLabel = getMineSessionCountdownLabel(countdownStep, t("mine.session.countdownGo"));
  const hasAttempts = (wallet?.totalAttempts ?? 0) > 0;
  const isStartVisible = status === "idle" || status === "finished";
  const canStartSession = isStartVisible && hasAttempts;

  useEffect(() => {
    if (!collectEffect) {
      return;
    }

    const counter = counterRef.current;
    const root = rootRef.current;
    const scene = sceneRef.current;

    if (!counter || !root || !scene) {
      return;
    }

    const counterRect = counter.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const startX = sceneRect.left - rootRect.left + collectEffect.sceneX * sceneRect.width;
    const startY = sceneRect.top - rootRect.top + collectEffect.sceneY * sceneRect.height;
    const endX = counterRect.left - rootRect.left + counterRect.width / 2;
    const endY = counterRect.top - rootRect.top + counterRect.height / 2;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 42;

    setFlyEffects((currentEffects) => [
      ...currentEffects.slice(-7),
      {
        endX,
        endY,
        id: collectEffect.id,
        kind: collectEffect.kind,
        midX,
        midY,
        startX,
        startY
      }
    ]);
  }, [collectEffect]);

  useEffect(() => {
    if (!missEffect) {
      return;
    }

    const root = rootRef.current;
    const scene = sceneRef.current;

    if (!root || !scene) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const x = sceneRect.left - rootRect.left + missEffect.sceneX * sceneRect.width;
    const y = sceneRect.top - rootRect.top + missEffect.sceneY * sceneRect.height;

    setPenaltyEffects((currentEffects) => [
      ...currentEffects.slice(-7),
      {
        id: missEffect.id,
        penalty: missEffect.penalty,
        x,
        y
      }
    ]);
  }, [missEffect]);

  function handleStartSession() {
    if (!canStartSession) {
      return;
    }

    startSession();
  }

  return (
    <section ref={rootRef} className="mine-session" aria-label={t("mine.session.label")}>
      <div className="mine-session__hud">
        <div
          ref={counterRef}
          className="mine-session__gold"
          aria-label={t("mine.session.goldLabel", { count: collectedGold })}
        >
          <img
            className="mine-session__gold-image"
            src={mineGoldImage}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <span className="mine-session__gold-count">{collectedGold}</span>
        </div>

        <time className="mine-session__timer" dateTime={`PT${timeLeftSeconds}S`}>
          {formatMineSessionTime(timeLeftSeconds)}
        </time>
      </div>

      <div ref={sceneRef} className="mine-session__scene">
        <MineScene
          activeZones={status === "running" ? activeZones : undefined}
          countdownLabel={countdownLabel}
          onCellClick={status === "running" ? handleMineCellClick : undefined}
        />

        {isStartVisible ? (
          <button
            className={clsx("mine-session__start", {
              "mine-session__start--disabled": !canStartSession
            })}
            type="button"
            disabled={!canStartSession}
            onClick={handleStartSession}
          >
            {getMineSessionButtonLabel(status, t("mine.session.start"), t("mine.session.restart"))}
          </button>
        ) : null}
      </div>

      <div className="mine-session__effects" aria-hidden="true">
        {flyEffects.map((effect) => (
          <img
            key={effect.id}
            className={clsx("mine-session__fly", {
              "mine-session__fly--gold": effect.kind === "gold",
              "mine-session__fly--ruby": effect.kind === "ruby"
            })}
            src={getMineSessionFlyEffectImage(effect.kind)}
            alt=""
            draggable={false}
            style={getMineSessionFlyEffectStyle(effect)}
            onAnimationEnd={() => {
              setFlyEffects((currentEffects) =>
                currentEffects.filter((currentEffect) => currentEffect.id !== effect.id)
              );
            }}
          />
        ))}

        {penaltyEffects.map((effect) => (
          <span
            key={effect.id}
            className="mine-session__penalty"
            style={getMineSessionPenaltyEffectStyle(effect)}
            onAnimationEnd={() => {
              setPenaltyEffects((currentEffects) =>
                currentEffects.filter((currentEffect) => currentEffect.id !== effect.id)
              );
            }}
          >
            <img
              className="mine-session__penalty-image"
              src={mineGoldImage}
              alt=""
              draggable={false}
            />
            <span className="mine-session__penalty-text">-{effect.penalty}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
