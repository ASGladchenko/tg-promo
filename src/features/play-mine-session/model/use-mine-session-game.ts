import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type MineSceneCellClick } from "@/entities/mine";

import { createMineZone } from "../lib/create-mine-zone";
import {
  createMineSessionJournalEntry,
  EMPTY_MINE_SESSION_RISK_STATE,
  evaluateMineSessionRisk,
  MINE_SESSION_MAX_JOURNAL_ENTRIES
} from "../lib/evaluate-mine-session-risk";
import { isMineZoneHit } from "../lib/is-mine-zone-hit";
import {
  type MineCollectEffect,
  type MineGameZone,
  type MineMissEffect,
  type MineSessionJournalEntry,
  type MineSessionRiskState,
  type MineSessionCountdownStep,
  type MineSessionStatus
} from "./types";

const MINE_SESSION_DURATION_MS = 30_000;
const MINE_START_COUNTDOWN_STEP_MS = 1_000;
const MINE_START_COUNTDOWN_STEPS: readonly MineSessionCountdownStep[] = ["3", "2", "1", "go"];
const MINE_MISS_PENALTY = 1;
const MINE_CLOCK_TICK_MS = 100;
const MINE_RUBY_MIN_SPAWN_DELAY_MS = 3000;
const MINE_RUBY_MAX_SPAWN_DELAY_MS = 7000;

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

function getRandomNumber(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getNextRubyZoneAt(now: number): number {
  return now + getRandomNumber(MINE_RUBY_MIN_SPAWN_DELAY_MS, MINE_RUBY_MAX_SPAWN_DELAY_MS);
}

function createMineCollectEffect(
  hitZone: MineGameZone,
  cellClick: MineSceneCellClick,
  clickAt: number
): MineCollectEffect {
  return {
    id: `${hitZone.id}-${clickAt}`,
    kind: hitZone.kind,
    sceneX: cellClick.sceneX,
    sceneY: cellClick.sceneY
  };
}

function createMineMissEffect(cellClick: MineSceneCellClick, clickAt: number): MineMissEffect {
  return {
    id: `miss-${clickAt}-${cellClick.cellIndex}-${Math.random().toString(16).slice(2)}`,
    penalty: MINE_MISS_PENALTY,
    sceneX: cellClick.sceneX,
    sceneY: cellClick.sceneY
  };
}

function getHitMineZone(zones: readonly MineGameZone[], cellClick: MineSceneCellClick, clickAt: number) {
  return zones
    .filter((zone) => clickAt < zone.expiresAt && isMineZoneHit(zone, cellClick))
    .sort((firstZone, secondZone) => secondZone.reward - firstZone.reward)[0] ?? null;
}

export function useMineSessionGame() {
  const [collectEffect, setCollectEffect] = useState<MineCollectEffect | null>(null);
  const [collectedGold, setCollectedGold] = useState(0);
  const [countdownStartedAt, setCountdownStartedAt] = useState<number | null>(null);
  const [goldZone, setGoldZone] = useState<MineGameZone | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [nextRubyZoneAt, setNextRubyZoneAt] = useState<number | null>(null);
  const [missEffect, setMissEffect] = useState<MineMissEffect | null>(null);
  const [riskState, setRiskState] = useState<MineSessionRiskState>(EMPTY_MINE_SESSION_RISK_STATE);
  const [rubyZone, setRubyZone] = useState<MineGameZone | null>(null);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [sessionJournal, setSessionJournal] = useState<readonly MineSessionJournalEntry[]>([]);
  const [status, setStatus] = useState<MineSessionStatus>("idle");
  const goldZoneRef = useRef<MineGameZone | null>(null);
  const journalSequenceRef = useRef(0);
  const nextRubyZoneAtRef = useRef<number | null>(null);
  const riskStateRef = useRef<MineSessionRiskState>(EMPTY_MINE_SESSION_RISK_STATE);
  const rubyZoneRef = useRef<MineGameZone | null>(null);
  const sessionEndsAtRef = useRef<number | null>(null);
  const sessionJournalRef = useRef<readonly MineSessionJournalEntry[]>([]);
  const sessionStartedAtRef = useRef<number | null>(null);
  const statusRef = useRef<MineSessionStatus>("idle");

  useEffect(() => {
    goldZoneRef.current = goldZone;
  }, [goldZone]);

  useEffect(() => {
    nextRubyZoneAtRef.current = nextRubyZoneAt;
  }, [nextRubyZoneAt]);

  useEffect(() => {
    rubyZoneRef.current = rubyZone;
  }, [rubyZone]);

  useEffect(() => {
    sessionEndsAtRef.current = sessionEndsAt;
  }, [sessionEndsAt]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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

    const sessionStartedAt = now;
    const nextSessionEndsAt = sessionStartedAt + MINE_SESSION_DURATION_MS;
    const nextGoldZone = createMineZone(sessionStartedAt, "gold");
    const nextRubyZoneAt = getNextRubyZoneAt(sessionStartedAt);

    goldZoneRef.current = nextGoldZone;
    nextRubyZoneAtRef.current = nextRubyZoneAt;
    rubyZoneRef.current = null;
    sessionEndsAtRef.current = nextSessionEndsAt;
    sessionStartedAtRef.current = sessionStartedAt;
    statusRef.current = "running";
    setCountdownStartedAt(null);
    setGoldZone(nextGoldZone);
    setNextRubyZoneAt(nextRubyZoneAt);
    setRubyZone(null);
    setSessionEndsAt(nextSessionEndsAt);
    setStatus("running");
  }, [countdownStartedAt, now, status]);

  useEffect(() => {
    if (status !== "running" || sessionEndsAt === null) {
      return;
    }

    if (now >= sessionEndsAt) {
      goldZoneRef.current = null;
      nextRubyZoneAtRef.current = null;
      rubyZoneRef.current = null;
      statusRef.current = "finished";
      setGoldZone(null);
      setNextRubyZoneAt(null);
      setRubyZone(null);
      setStatus("finished");
      return;
    }

    const nextGoldZone =
      goldZone && now < goldZone.expiresAt
        ? goldZone
        : createMineZone(now, "gold", rubyZone ? [rubyZone.cellIndex] : []);
    let nextRubyZone = rubyZone && now < rubyZone.expiresAt ? rubyZone : null;
    let nextRubyZoneAt = nextRubyZoneAtRef.current;

    if (rubyZone && now >= rubyZone.expiresAt) {
      nextRubyZoneAt = getNextRubyZoneAt(now);
    }

    if (!nextRubyZone && nextRubyZoneAt !== null && now >= nextRubyZoneAt) {
      nextRubyZone = createMineZone(now, "ruby", [nextGoldZone.cellIndex]);
      nextRubyZoneAt = null;
    }

    if (nextGoldZone !== goldZone) {
      goldZoneRef.current = nextGoldZone;
      setGoldZone(nextGoldZone);
    }

    if (nextRubyZone !== rubyZone) {
      rubyZoneRef.current = nextRubyZone;
      setRubyZone(nextRubyZone);
    }

    if (nextRubyZoneAt !== nextRubyZoneAtRef.current) {
      nextRubyZoneAtRef.current = nextRubyZoneAt;
      setNextRubyZoneAt(nextRubyZoneAt);
    }
  }, [goldZone, now, rubyZone, sessionEndsAt, status]);

  const countdownStep = useMemo(() => {
    if (status !== "countdown" || countdownStartedAt === null) {
      return null;
    }

    return getCountdownStep(now - countdownStartedAt);
  }, [countdownStartedAt, now, status]);

  const timeLeftSeconds = useMemo(() => {
    return getTimeLeftSeconds(status, sessionEndsAt, now);
  }, [now, sessionEndsAt, status]);

  const startSession = useCallback(() => {
    const startedAt = Date.now();

    goldZoneRef.current = null;
    nextRubyZoneAtRef.current = null;
    riskStateRef.current = EMPTY_MINE_SESSION_RISK_STATE;
    rubyZoneRef.current = null;
    sessionEndsAtRef.current = null;
    sessionJournalRef.current = [];
    sessionStartedAtRef.current = null;
    statusRef.current = "countdown";
    journalSequenceRef.current = 0;
    setCollectEffect(null);
    setCollectedGold(0);
    setCountdownStartedAt(startedAt);
    setGoldZone(null);
    setNow(startedAt);
    setNextRubyZoneAt(null);
    setMissEffect(null);
    setRiskState(EMPTY_MINE_SESSION_RISK_STATE);
    setRubyZone(null);
    setSessionEndsAt(null);
    setSessionJournal([]);
    setStatus("countdown");
  }, []);

  const handleMineCellClick = useCallback((cellClick: MineSceneCellClick) => {
    const currentStatus = statusRef.current;
    const currentGoldZone = goldZoneRef.current;
    const currentRubyZone = rubyZoneRef.current;
    const currentSessionEndsAt = sessionEndsAtRef.current;
    const clickAt = Date.now();

    if (currentStatus !== "running" || !currentGoldZone || currentSessionEndsAt === null) {
      return;
    }

    if (clickAt >= currentSessionEndsAt) {
      return;
    }

    const zones = [currentRubyZone, currentGoldZone].filter((zone): zone is MineGameZone => Boolean(zone));
    const hitZone = getHitMineZone(zones, cellClick, clickAt);
    const currentSessionJournal = sessionJournalRef.current;
    const nextRiskState = evaluateMineSessionRisk({
      cellClick,
      clickedAt: clickAt,
      hitZone,
      journal: currentSessionJournal,
      previousRiskState: riskStateRef.current
    });
    const isRewardBlocked = Boolean(hitZone) && nextRiskState.level === "blocked";
    const rewardDelta = hitZone && !isRewardBlocked ? hitZone.reward : -MINE_MISS_PENALTY;
    const previousJournalEntry = currentSessionJournal[currentSessionJournal.length - 1] ?? null;
    const sessionStartedAt = sessionStartedAtRef.current ?? clickAt;
    const sequence = journalSequenceRef.current + 1;
    const nextJournalEntry = createMineSessionJournalEntry({
      cellClick,
      clickedAt: clickAt,
      hitZone,
      isRewardBlocked,
      previousEntry: previousJournalEntry,
      rewardDelta,
      riskState: nextRiskState,
      sequence,
      sessionStartedAt
    });
    const nextSessionJournal = [...currentSessionJournal, nextJournalEntry].slice(
      -MINE_SESSION_MAX_JOURNAL_ENTRIES
    );

    journalSequenceRef.current = sequence;
    riskStateRef.current = nextRiskState;
    sessionJournalRef.current = nextSessionJournal;
    setRiskState(nextRiskState);
    setSessionJournal(nextSessionJournal);

    setCollectedGold((currentGold) => Math.max(0, currentGold + rewardDelta));

    if (hitZone && !isRewardBlocked) {
      setCollectEffect(createMineCollectEffect(hitZone, cellClick, clickAt));
    } else {
      setMissEffect(createMineMissEffect(cellClick, clickAt));
    }

    if (hitZone?.kind === "gold" && !isRewardBlocked) {
      const nextGoldZone = createMineZone(clickAt, "gold", currentRubyZone ? [currentRubyZone.cellIndex] : []);

      goldZoneRef.current = nextGoldZone;
      setGoldZone(nextGoldZone);
    }

    if (hitZone?.kind === "ruby" && !isRewardBlocked) {
      const nextRubyZoneAt = getNextRubyZoneAt(clickAt);

      nextRubyZoneAtRef.current = nextRubyZoneAt;
      rubyZoneRef.current = null;
      setNextRubyZoneAt(nextRubyZoneAt);
      setRubyZone(null);
    }

    setNow(clickAt);
  }, []);

  const activeZones = useMemo(() => {
    return [goldZone, rubyZone].filter((zone): zone is MineGameZone => Boolean(zone));
  }, [goldZone, rubyZone]);

  return {
    activeZones,
    collectEffect,
    collectedGold,
    countdownStep,
    handleMineCellClick,
    missEffect,
    riskState,
    sessionJournal,
    startSession,
    status,
    timeLeftSeconds
  };
}
