import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { setAttemptsWalletQueryData } from "@/entities/attempts";
import {
  createMineSocketClient,
  type MineClickSessionResult,
  type MineSceneCellClick,
  type MineServerSessionState,
  type MineServerZone,
  type MineSocketClient,
  type MineSocketError,
  type MineStartSessionResult
} from "@/entities/mine";

import { isMineZoneHit } from "../lib/is-mine-zone-hit";
import {
  type MineCollectEffect,
  type MineGameZone,
  type MineMissEffect,
  type MineSessionCountdownStep,
  type MineSessionStatus
} from "./types";

const MINE_SESSION_DURATION_MS = 30_000;
const MINE_START_COUNTDOWN_STEP_MS = 1_000;
const MINE_START_COUNTDOWN_STEPS: readonly MineSessionCountdownStep[] = ["3", "2", "1", "go"];
const MINE_MISS_PENALTY = 1;
const MINE_CLOCK_TICK_MS = 100;
const MINE_STATE_REFRESH_MIN_DELAY_MS = 80;
const MINE_STATE_REFRESH_OFFSET_MS = 40;

type MinePendingClick = {
  cellClick: MineSceneCellClick;
  clickedAt: number;
  sequence: number;
};

function getCountdownStep(elapsedMs: number): MineSessionCountdownStep | null {
  const stepIndex = Math.floor(elapsedMs / MINE_START_COUNTDOWN_STEP_MS);

  return MINE_START_COUNTDOWN_STEPS[stepIndex] ?? null;
}

function getTimeLeftSeconds(status: MineSessionStatus, sessionEndsAt: number | null, now: number): number {
  if (status === "finished") {
    return 0;
  }

  if (status !== "running" || sessionEndsAt === null) {
    return MINE_SESSION_DURATION_MS / 1000;
  }

  return Math.ceil(Math.max(0, sessionEndsAt - now) / 1000);
}

function parseServerDate(value: string): number | null {
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : null;
}

function mapMineServerZoneToGameZone(zone: MineServerZone): MineGameZone {
  return {
    cellIndex: zone.cellIndex,
    expiresAt: parseServerDate(zone.expiresAt) ?? Date.now(),
    id: zone.id,
    kind: zone.kind,
    radius: zone.radius,
    reward: zone.reward,
    startsAt: parseServerDate(zone.startsAt) ?? Date.now(),
    x: zone.x,
    y: zone.y
  };
}

function createMineCollectEffect(
  kind: MineCollectEffect["kind"],
  cellClick: MineSceneCellClick,
  id: string
): MineCollectEffect {
  return {
    id,
    kind,
    sceneX: cellClick.sceneX,
    sceneY: cellClick.sceneY
  };
}

function createMineMissEffect(cellClick: MineSceneCellClick, penalty: number, id: string): MineMissEffect {
  return {
    id,
    penalty,
    sceneX: cellClick.sceneX,
    sceneY: cellClick.sceneY
  };
}

function getHitMineZone(zones: readonly MineGameZone[], cellClick: MineSceneCellClick, clickAt: number) {
  return (
    zones
      .filter((zone) => clickAt < zone.expiresAt && isMineZoneHit(zone, cellClick))
      .sort((firstZone, secondZone) => secondZone.reward - firstZone.reward)[0] ?? null
  );
}

function getPendingClickMaxSequence(pendingClicks: Iterable<MinePendingClick>): number | null {
  let maxSequence: number | null = null;

  for (const pendingClick of pendingClicks) {
    maxSequence = maxSequence === null ? pendingClick.sequence : Math.max(maxSequence, pendingClick.sequence);
  }

  return maxSequence;
}

export function useMineSessionGame() {
  const queryClient = useQueryClient();
  const [activeZones, setActiveZones] = useState<readonly MineGameZone[]>([]);
  const [collectEffect, setCollectEffect] = useState<MineCollectEffect | null>(null);
  const [collectedGold, setCollectedGold] = useState(0);
  const [countdownStartedAt, setCountdownStartedAt] = useState<number | null>(null);
  const [missEffect, setMissEffect] = useState<MineMissEffect | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [serverClockOffset, setServerClockOffset] = useState(0);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [socketError, setSocketError] = useState<MineSocketError | null>(null);
  const [status, setStatus] = useState<MineSessionStatus>("idle");
  const activeZonesRef = useRef<readonly MineGameZone[]>([]);
  const clickSequenceRef = useRef(0);
  const pendingClicksRef = useRef(new Map<string, MinePendingClick>());
  const serverClockOffsetRef = useRef(0);
  const sessionEndsAtRef = useRef<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const socketClientRef = useRef<MineSocketClient | null>(null);
  const startRequestIdRef = useRef<string | null>(null);
  const stateRefreshTimeoutRef = useRef<number | null>(null);
  const statusRef = useRef<MineSessionStatus>("idle");

  const clearStateRefreshTimeout = useCallback(() => {
    if (stateRefreshTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(stateRefreshTimeoutRef.current);
    stateRefreshTimeoutRef.current = null;
  }, []);

  const applySessionState = useCallback(
    (sessionState: MineServerSessionState) => {
      const serverTime = parseServerDate(sessionState.serverTime);
      const nextServerClockOffset = serverTime === null ? serverClockOffsetRef.current : serverTime - Date.now();
      const nextSessionEndsAt = parseServerDate(sessionState.endsAt);
      const nextActiveZones =
        sessionState.status === "running" ? sessionState.activeZones.map(mapMineServerZoneToGameZone) : [];
      const nextStatus: MineSessionStatus = sessionState.status === "running" ? "running" : "finished";
      const pendingClickMaxSequence = getPendingClickMaxSequence(pendingClicksRef.current.values());

      activeZonesRef.current = nextActiveZones;
      clickSequenceRef.current =
        pendingClickMaxSequence === null
          ? sessionState.clickSequence
          : Math.max(sessionState.clickSequence, pendingClickMaxSequence);
      serverClockOffsetRef.current = nextServerClockOffset;
      sessionEndsAtRef.current = nextSessionEndsAt;
      sessionIdRef.current = sessionState.id;
      statusRef.current = nextStatus;

      setActiveZones(nextActiveZones);
      setCollectedGold(sessionState.score);
      setServerClockOffset(nextServerClockOffset);
      setSessionEndsAt(nextSessionEndsAt);
      setStatus(nextStatus);

      if (nextStatus === "finished") {
        clearStateRefreshTimeout();
      }
    },
    [clearStateRefreshTimeout]
  );

  const scheduleStateRefresh = useCallback(
    (sessionState: MineServerSessionState) => {
      clearStateRefreshTimeout();

      if (sessionState.status !== "running") {
        return;
      }

      const nextRefreshAt = parseServerDate(sessionState.nextRefreshAt);

      if (nextRefreshAt === null) {
        return;
      }

      const currentServerTime = Date.now() + serverClockOffsetRef.current;
      const delayMs = Math.max(
        MINE_STATE_REFRESH_MIN_DELAY_MS,
        nextRefreshAt - currentServerTime + MINE_STATE_REFRESH_OFFSET_MS
      );
      const sessionId = sessionState.id;

      stateRefreshTimeoutRef.current = window.setTimeout(() => {
        if (statusRef.current !== "running" || sessionIdRef.current !== sessionId) {
          return;
        }

        socketClientRef.current?.requestState(sessionId);
      }, delayMs);
    },
    [clearStateRefreshTimeout]
  );

  const syncSessionState = useCallback(
    (sessionState: MineServerSessionState) => {
      applySessionState(sessionState);
      scheduleStateRefresh(sessionState);
    },
    [applySessionState, scheduleStateRefresh]
  );

  const handleSocketError = useCallback(
    (error: MineSocketError, requestId: string | null) => {
      setSocketError(error);

      if (requestId) {
        pendingClicksRef.current.delete(requestId);
      }

      if (statusRef.current === "starting") {
        statusRef.current = "finished";
        startRequestIdRef.current = null;
        setStatus("finished");
        clearStateRefreshTimeout();
      }

      if (statusRef.current === "running" && sessionIdRef.current) {
        socketClientRef.current?.requestState(sessionIdRef.current);
      }
    },
    [clearStateRefreshTimeout]
  );

  const handleSessionStarted = useCallback(
    (payload: MineStartSessionResult, requestId: string | null) => {
      if (requestId && startRequestIdRef.current && requestId !== startRequestIdRef.current) {
        return;
      }

      startRequestIdRef.current = null;
      clickSequenceRef.current = 0;
      setAttemptsWalletQueryData(queryClient, payload.wallet);
      syncSessionState(payload);
    },
    [queryClient, syncSessionState]
  );

  const handleClickResult = useCallback(
    (payload: MineClickSessionResult, requestId: string | null) => {
      const pendingClick = requestId ? pendingClicksRef.current.get(requestId) ?? null : null;

      if (requestId) {
        pendingClicksRef.current.delete(requestId);
      }

      syncSessionState(payload);

      if (!pendingClick) {
        return;
      }

      const effectId = requestId ?? `mine-click-${pendingClick.clickedAt}`;

      if (payload.click.outcome === "hit" && payload.click.targetKind) {
        setCollectEffect(createMineCollectEffect(payload.click.targetKind, pendingClick.cellClick, effectId));
        return;
      }

      setMissEffect(
        createMineMissEffect(
          pendingClick.cellClick,
          Math.abs(payload.click.rewardDelta) || MINE_MISS_PENALTY,
          effectId
        )
      );
    },
    [syncSessionState]
  );

  const handleSocketClose = useCallback(() => {
    socketClientRef.current = null;
    clearStateRefreshTimeout();

    if (statusRef.current !== "starting" && statusRef.current !== "running") {
      return;
    }

    activeZonesRef.current = [];
    statusRef.current = "finished";
    setActiveZones([]);
    setStatus("finished");
  }, [clearStateRefreshTimeout]);

  const getSocketClient = useCallback(() => {
    if (socketClientRef.current) {
      return socketClientRef.current;
    }

    const socketClient = createMineSocketClient({
      onClickResult: handleClickResult,
      onClose: handleSocketClose,
      onError: handleSocketError,
      onStarted: handleSessionStarted,
      onState: (payload) => {
        syncSessionState(payload);
      }
    });

    socketClientRef.current = socketClient;

    return socketClient;
  }, [handleClickResult, handleSessionStarted, handleSocketClose, handleSocketError, syncSessionState]);

  useEffect(() => {
    return () => {
      clearStateRefreshTimeout();
      socketClientRef.current?.close();
      socketClientRef.current = null;
    };
  }, [clearStateRefreshTimeout]);

  useEffect(() => {
    if (status === "idle" || status === "finished") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, MINE_CLOCK_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "countdown" || countdownStartedAt === null) {
      return;
    }

    const elapsedMs = now - countdownStartedAt;
    const countdownDurationMs = MINE_START_COUNTDOWN_STEPS.length * MINE_START_COUNTDOWN_STEP_MS;

    if (elapsedMs < countdownDurationMs) {
      return;
    }

    statusRef.current = "starting";
    setCountdownStartedAt(null);
    setStatus("starting");
    startRequestIdRef.current = getSocketClient().startSession();
  }, [countdownStartedAt, getSocketClient, now, status]);

  useEffect(() => {
    if (status !== "running" || sessionEndsAt === null) {
      return;
    }

    if (now + serverClockOffset < sessionEndsAt) {
      return;
    }

    activeZonesRef.current = [];
    statusRef.current = "finished";
    setActiveZones([]);
    setStatus("finished");
    clearStateRefreshTimeout();
  }, [clearStateRefreshTimeout, now, serverClockOffset, sessionEndsAt, status]);

  const countdownStep = useMemo(() => {
    if (status !== "countdown" || countdownStartedAt === null) {
      return null;
    }

    return getCountdownStep(now - countdownStartedAt);
  }, [countdownStartedAt, now, status]);

  const timeLeftSeconds = useMemo(() => {
    return getTimeLeftSeconds(status, sessionEndsAt, now + serverClockOffset);
  }, [now, serverClockOffset, sessionEndsAt, status]);

  const startSession = useCallback(() => {
    const startedAt = Date.now();

    activeZonesRef.current = [];
    clickSequenceRef.current = 0;
    pendingClicksRef.current.clear();
    serverClockOffsetRef.current = 0;
    sessionEndsAtRef.current = null;
    sessionIdRef.current = null;
    startRequestIdRef.current = null;
    statusRef.current = "countdown";
    clearStateRefreshTimeout();
    setActiveZones([]);
    setCollectEffect(null);
    setCollectedGold(0);
    setCountdownStartedAt(startedAt);
    setMissEffect(null);
    setNow(startedAt);
    setServerClockOffset(0);
    setSessionEndsAt(null);
    setSocketError(null);
    setStatus("countdown");
  }, [clearStateRefreshTimeout]);

  const handleMineCellClick = useCallback((cellClick: MineSceneCellClick) => {
    const currentStatus = statusRef.current;
    const currentSessionId = sessionIdRef.current;
    const currentSessionEndsAt = sessionEndsAtRef.current;
    const clickedAt = Date.now() + serverClockOffsetRef.current;

    if (currentStatus !== "running" || !currentSessionId || currentSessionEndsAt === null) {
      return;
    }

    if (clickedAt >= currentSessionEndsAt) {
      return;
    }

    const hitZone = getHitMineZone(activeZonesRef.current, cellClick, clickedAt);
    const sequence = clickSequenceRef.current + 1;
    const requestId = getSocketClient().submitClick(currentSessionId, {
      cellIndex: cellClick.cellIndex,
      cellX: cellClick.cellX,
      cellY: cellClick.cellY,
      clientClickedAt: new Date(clickedAt).toISOString(),
      sceneX: cellClick.sceneX,
      sceneY: cellClick.sceneY,
      sequence,
      zoneId: hitZone?.id ?? null
    });

    clickSequenceRef.current = sequence;
    pendingClicksRef.current.set(requestId, {
      cellClick,
      clickedAt,
      sequence
    });
  }, [getSocketClient]);

  return {
    activeZones,
    collectEffect,
    collectedGold,
    countdownStep,
    handleMineCellClick,
    missEffect,
    socketError,
    startSession,
    status,
    timeLeftSeconds
  };
}
