import { type MineSceneCellClick } from "@/entities/mine";

import {
  type MineGameZone,
  type MineSessionClickOutcome,
  type MineSessionJournalEntry,
  type MineSessionRiskFlag,
  type MineSessionRiskLevel,
  type MineSessionRiskState
} from "../model/types";

type EvaluateMineSessionRiskParams = {
  cellClick: MineSceneCellClick;
  clickedAt: number;
  hitZone: MineGameZone | null;
  journal: readonly MineSessionJournalEntry[];
  previousRiskState: MineSessionRiskState;
};

type CreateMineSessionJournalEntryParams = {
  cellClick: MineSceneCellClick;
  clickedAt: number;
  hitZone: MineGameZone | null;
  isRewardBlocked: boolean;
  previousEntry: MineSessionJournalEntry | null;
  rewardDelta: number;
  riskState: MineSessionRiskState;
  sequence: number;
  sessionStartedAt: number;
};

const MINE_SESSION_RISK_BLOCK_SCORE = 85;
const MINE_SESSION_RISK_WATCH_SCORE = 45;
const MINE_SESSION_RISK_SCORE_LIMIT = 100;
const MINE_SESSION_FAST_REACTION_MS = 120;
const MINE_SESSION_RAPID_CLICK_MS = 95;
const MINE_SESSION_PERFECT_ZONE_DISTANCE_RATIO = 0.18;
const MINE_SESSION_REPEAT_POINT_DISTANCE = 0.004;
const MINE_SESSION_LOW_JITTER_SAMPLE_SIZE = 5;
const MINE_SESSION_LOW_JITTER_MAX_AVG_INTERVAL_MS = 520;
const MINE_SESSION_LOW_JITTER_MAX_DEVIATION_MS = 28;
const MINE_SESSION_HIGH_PRECISION_SAMPLE_SIZE = 8;
const MINE_SESSION_HIGH_PRECISION_MIN_HIT_RATE = 0.88;
const MINE_SESSION_HIGH_PRECISION_MAX_AVG_DISTANCE_RATIO = 0.34;
const MINE_SESSION_HIGH_PRECISION_MAX_AVG_REACTION_MS = 190;
export const MINE_SESSION_MAX_JOURNAL_ENTRIES = 160;
export const EMPTY_MINE_SESSION_RISK_STATE: MineSessionRiskState = {
  flags: [],
  level: "clear",
  score: 0
};

function getMineSessionRiskLevel(score: number): MineSessionRiskLevel {
  if (score >= MINE_SESSION_RISK_BLOCK_SCORE) {
    return "blocked";
  }

  if (score >= MINE_SESSION_RISK_WATCH_SCORE) {
    return "watch";
  }

  return "clear";
}

function addMineSessionRiskFlag(flags: Set<MineSessionRiskFlag>, flag: MineSessionRiskFlag) {
  flags.add(flag);
}

function getMineSessionIntervalMs(
  previousEntry: MineSessionJournalEntry | null,
  clickedAt: number
): number | null {
  if (!previousEntry) {
    return null;
  }

  return clickedAt - previousEntry.clickedAt;
}

function getMineSessionZoneDistanceRatio(hitZone: MineGameZone, cellClick: MineSceneCellClick): number {
  const distanceX = (cellClick.cellX - hitZone.x) * cellClick.cellWidth;
  const distanceY = (cellClick.cellY - hitZone.y) * cellClick.cellHeight;
  const distance = Math.hypot(distanceX, distanceY);
  const zoneRadius = Math.min(cellClick.cellWidth, cellClick.cellHeight) * hitZone.radius;

  if (zoneRadius <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return distance / zoneRadius;
}

function getMineSessionAverage(numbers: readonly number[]): number {
  if (numbers.length === 0) {
    return 0;
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function getMineSessionStandardDeviation(numbers: readonly number[]): number {
  if (numbers.length < 2) {
    return 0;
  }

  const average = getMineSessionAverage(numbers);
  const variance =
    numbers.reduce((sum, value) => sum + (value - average) ** 2, 0) / numbers.length;

  return Math.sqrt(variance);
}

function getMineSessionRecentIntervals(
  journal: readonly MineSessionJournalEntry[],
  currentIntervalMs: number | null
): number[] {
  const intervals = [...journal.map((entry) => entry.intervalMs), currentIntervalMs];

  return intervals
    .slice(-MINE_SESSION_LOW_JITTER_SAMPLE_SIZE)
    .filter((intervalMs): intervalMs is number => intervalMs !== null);
}

function hasMineSessionRepeatedPoint(
  journal: readonly MineSessionJournalEntry[],
  cellClick: MineSceneCellClick
) {
  return journal.slice(-6).some((entry) => {
    const distance = Math.hypot(entry.sceneX - cellClick.sceneX, entry.sceneY - cellClick.sceneY);

    return distance <= MINE_SESSION_REPEAT_POINT_DISTANCE;
  });
}

function getMineSessionRiskOutcome(hitZone: MineGameZone | null, isRewardBlocked: boolean): MineSessionClickOutcome {
  if (isRewardBlocked) {
    return "blocked";
  }

  if (hitZone) {
    return "hit";
  }

  return "miss";
}

function getMineSessionRiskScore(flags: ReadonlySet<MineSessionRiskFlag>, previousScore: number) {
  let score = previousScore;

  if (flags.has("fast-reaction")) {
    score += 22;
  }

  if (flags.has("perfect-zone-click")) {
    score += 12;
  }

  if (flags.has("rapid-click")) {
    score += 18;
  }

  if (flags.has("repeated-point")) {
    score += 20;
  }

  if (flags.has("low-jitter-intervals")) {
    score += 22;
  }

  if (flags.has("high-precision-run")) {
    score += 24;
  }

  return Math.min(MINE_SESSION_RISK_SCORE_LIMIT, score);
}

function getMineSessionRecentPrecisionEntries(
  journal: readonly MineSessionJournalEntry[],
  currentEntry: MineSessionJournalEntry
) {
  return [...journal, currentEntry].slice(-MINE_SESSION_HIGH_PRECISION_SAMPLE_SIZE);
}

function hasMineSessionHighPrecisionRun(entries: readonly MineSessionJournalEntry[]) {
  if (entries.length < MINE_SESSION_HIGH_PRECISION_SAMPLE_SIZE) {
    return false;
  }

  const hits = entries.filter((entry) => entry.outcome === "hit" && entry.targetKind !== null);
  const hitRate = hits.length / entries.length;

  if (hitRate < MINE_SESSION_HIGH_PRECISION_MIN_HIT_RATE) {
    return false;
  }

  const distances = hits
    .map((entry) => entry.zoneDistanceRatio)
    .filter((distance): distance is number => distance !== null);
  const reactions = hits
    .map((entry) => entry.reactionMs)
    .filter((reactionMs): reactionMs is number => reactionMs !== null);

  if (distances.length === 0 || reactions.length === 0) {
    return false;
  }

  return (
    getMineSessionAverage(distances) <= MINE_SESSION_HIGH_PRECISION_MAX_AVG_DISTANCE_RATIO &&
    getMineSessionAverage(reactions) <= MINE_SESSION_HIGH_PRECISION_MAX_AVG_REACTION_MS
  );
}

export function createMineSessionJournalEntry({
  cellClick,
  clickedAt,
  hitZone,
  isRewardBlocked,
  previousEntry,
  rewardDelta,
  riskState,
  sequence,
  sessionStartedAt
}: CreateMineSessionJournalEntryParams): MineSessionJournalEntry {
  const reactionMs = hitZone ? clickedAt - hitZone.startsAt : null;
  const zoneDistanceRatio = hitZone ? getMineSessionZoneDistanceRatio(hitZone, cellClick) : null;

  return {
    cellIndex: cellClick.cellIndex,
    cellX: cellClick.cellX,
    cellY: cellClick.cellY,
    clickedAt,
    elapsedMs: clickedAt - sessionStartedAt,
    id: `${clickedAt}-${sequence}-${cellClick.cellIndex}`,
    intervalMs: getMineSessionIntervalMs(previousEntry, clickedAt),
    outcome: getMineSessionRiskOutcome(hitZone, isRewardBlocked),
    reactionMs,
    rewardDelta,
    riskFlags: riskState.flags,
    riskScore: riskState.score,
    sceneX: cellClick.sceneX,
    sceneY: cellClick.sceneY,
    sequence,
    targetKind: hitZone?.kind ?? null,
    wasRewardBlocked: isRewardBlocked,
    zoneDistanceRatio
  };
}

export function evaluateMineSessionRisk({
  cellClick,
  clickedAt,
  hitZone,
  journal,
  previousRiskState
}: EvaluateMineSessionRiskParams): MineSessionRiskState {
  const flags = new Set<MineSessionRiskFlag>();
  const previousEntry = journal[journal.length - 1] ?? null;
  const intervalMs = getMineSessionIntervalMs(previousEntry, clickedAt);

  if (intervalMs !== null && intervalMs < MINE_SESSION_RAPID_CLICK_MS) {
    addMineSessionRiskFlag(flags, "rapid-click");
  }

  if (hasMineSessionRepeatedPoint(journal, cellClick)) {
    addMineSessionRiskFlag(flags, "repeated-point");
  }

  if (hitZone) {
    const reactionMs = clickedAt - hitZone.startsAt;
    const distanceRatio = getMineSessionZoneDistanceRatio(hitZone, cellClick);

    if (reactionMs < MINE_SESSION_FAST_REACTION_MS) {
      addMineSessionRiskFlag(flags, "fast-reaction");
    }

    if (distanceRatio < MINE_SESSION_PERFECT_ZONE_DISTANCE_RATIO) {
      addMineSessionRiskFlag(flags, "perfect-zone-click");
    }
  }

  const intervals = getMineSessionRecentIntervals(journal, intervalMs);
  const averageInterval = getMineSessionAverage(intervals);
  const intervalDeviation = getMineSessionStandardDeviation(intervals);

  if (
    intervals.length >= MINE_SESSION_LOW_JITTER_SAMPLE_SIZE - 1 &&
    averageInterval <= MINE_SESSION_LOW_JITTER_MAX_AVG_INTERVAL_MS &&
    intervalDeviation <= MINE_SESSION_LOW_JITTER_MAX_DEVIATION_MS
  ) {
    addMineSessionRiskFlag(flags, "low-jitter-intervals");
  }

  const riskStateWithCurrentFlags: MineSessionRiskState = {
    flags: [...flags],
    level: previousRiskState.level,
    score: previousRiskState.score
  };
  const currentEntry = createMineSessionJournalEntry({
    cellClick,
    clickedAt,
    hitZone,
    isRewardBlocked: false,
    previousEntry,
    rewardDelta: hitZone?.reward ?? 0,
    riskState: riskStateWithCurrentFlags,
    sequence: journal.length + 1,
    sessionStartedAt: journal[0]?.clickedAt ?? clickedAt
  });

  if (hasMineSessionHighPrecisionRun(getMineSessionRecentPrecisionEntries(journal, currentEntry))) {
    addMineSessionRiskFlag(flags, "high-precision-run");
  }

  const score = getMineSessionRiskScore(flags, previousRiskState.score);

  return {
    flags: [...flags],
    level: getMineSessionRiskLevel(score),
    score
  };
}
