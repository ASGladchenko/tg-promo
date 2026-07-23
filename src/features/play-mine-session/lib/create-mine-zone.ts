import { type MineSceneCellIndex, type MineSceneZoneKind } from "@/entities/mine";

import { type MineGameZone } from "../model/types";

const MINE_CELL_COUNT = 9;
const MINE_GOLD_ZONE_MIN_DURATION_MS = 600;
const MINE_GOLD_ZONE_MAX_DURATION_MS = 1400;
const MINE_RUBY_ZONE_MIN_DURATION_MS = 350;
const MINE_RUBY_ZONE_MAX_DURATION_MS = 800;
const MINE_ZONE_MIN_RADIUS = 0.16;
const MINE_ZONE_MAX_RADIUS = 0.22;
const MINE_GOLD_REWARD = 1;
const MINE_RUBY_REWARD = 5;

function createMineZoneId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getRandomNumber(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getRandomInteger(min: number, max: number): number {
  return Math.floor(getRandomNumber(min, max + 1));
}

function getMineZoneReward(kind: MineSceneZoneKind): number {
  if (kind === "ruby") {
    return MINE_RUBY_REWARD;
  }

  return MINE_GOLD_REWARD;
}

function getMineZoneDurationMs(kind: MineSceneZoneKind): number {
  if (kind === "ruby") {
    return getRandomInteger(MINE_RUBY_ZONE_MIN_DURATION_MS, MINE_RUBY_ZONE_MAX_DURATION_MS);
  }

  return getRandomInteger(MINE_GOLD_ZONE_MIN_DURATION_MS, MINE_GOLD_ZONE_MAX_DURATION_MS);
}

function getMineZoneCellIndex(excludedCellIndexes: readonly MineSceneCellIndex[]): MineSceneCellIndex {
  const availableCellIndexes = Array.from({ length: MINE_CELL_COUNT }, (_, index) => index).filter(
    (cellIndex) => !excludedCellIndexes.includes(cellIndex as MineSceneCellIndex)
  );
  const cellIndexes = availableCellIndexes.length > 0 ? availableCellIndexes : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const randomIndex = getRandomInteger(0, cellIndexes.length - 1);

  return cellIndexes[randomIndex] as MineSceneCellIndex;
}

export function createMineZone(
  startsAt: number,
  kind: MineSceneZoneKind = "gold",
  excludedCellIndexes: readonly MineSceneCellIndex[] = []
): MineGameZone {
  const radius = getRandomNumber(MINE_ZONE_MIN_RADIUS, MINE_ZONE_MAX_RADIUS);
  const durationMs = getMineZoneDurationMs(kind);

  return {
    cellIndex: getMineZoneCellIndex(excludedCellIndexes),
    expiresAt: startsAt + durationMs,
    id: createMineZoneId(),
    kind,
    radius,
    reward: getMineZoneReward(kind),
    startsAt,
    x: getRandomNumber(radius, 1 - radius),
    y: getRandomNumber(radius, 1 - radius)
  };
}
