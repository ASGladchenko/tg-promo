import {
  type LuckyMeadowCellOutcomeDto,
  type LuckyMeadowOpenedCellDto,
  type LuckyMeadowPrizeDto,
  type LuckyMeadowSnapshotStatusDto,
  type LuckyMeadowStateResponseDto,
  type LuckyMeadowUnavailableReasonDto,
  type OpenLuckyMeadowCellResponseDto,
  type StartLuckyMeadowSnapshotResponseDto
} from "./types";

const CELL_OUTCOMES = new Set<LuckyMeadowCellOutcomeDto>(["empty", "jackpot", "semi_jackpot", "trap"]);
const PRIZES = new Set<LuckyMeadowPrizeDto>(["jackpot", "semi_jackpot"]);
const SNAPSHOT_STATUSES = new Set<LuckyMeadowSnapshotStatusDto>([
  "active",
  "finished",
  "refund_pending",
  "refunded"
]);
const UNAVAILABLE_REASONS = new Set<LuckyMeadowUnavailableReasonDto>(["daily_limit_reached"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isCellPosition(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 23;
}

function isCellOutcomeDto(value: unknown): value is LuckyMeadowCellOutcomeDto {
  return typeof value === "string" && CELL_OUTCOMES.has(value as LuckyMeadowCellOutcomeDto);
}

function isSnapshotStatusDto(value: unknown): value is LuckyMeadowSnapshotStatusDto {
  return typeof value === "string" && SNAPSHOT_STATUSES.has(value as LuckyMeadowSnapshotStatusDto);
}

function isPrizeDto(value: unknown): value is LuckyMeadowPrizeDto {
  return typeof value === "string" && PRIZES.has(value as LuckyMeadowPrizeDto);
}

function isOpenedCellDto(value: unknown): value is LuckyMeadowOpenedCellDto {
  if (!isRecord(value)) {
    return false;
  }

  return isCellPosition(value.position) && isCellOutcomeDto(value.outcome);
}

function isOpenedCellDtos(value: unknown): value is LuckyMeadowOpenedCellDto[] {
  return Array.isArray(value) && value.every(isOpenedCellDto);
}

function isGameDto(value: unknown): value is Exclude<LuckyMeadowStateResponseDto["game"], null> {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.endDate === "string" &&
    typeof value.snapshotId === "string" &&
    typeof value.startDate === "string" &&
    isSnapshotStatusDto(value.status)
  );
}

function isMySnapshotDto(value: unknown): value is Exclude<LuckyMeadowStateResponseDto["mySnapshot"], null> {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" && isOpenedCellDtos(value.openedCells) && isSnapshotStatusDto(value.status)
  );
}

function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || typeof value === "number";
}

export function isLuckyMeadowStateResponseDto(value: unknown): value is LuckyMeadowStateResponseDto {
  if (!isRecord(value)) {
    return false;
  }

  const hasValidUnavailableReason =
    value.unavailableReason === undefined ||
    (typeof value.unavailableReason === "string" &&
      UNAVAILABLE_REASONS.has(value.unavailableReason as LuckyMeadowUnavailableReasonDto));

  return (
    (value.game === null || isGameDto(value.game)) &&
    (value.mySnapshot === null || isMySnapshotDto(value.mySnapshot)) &&
    hasValidUnavailableReason
  );
}

export function isStartLuckyMeadowSnapshotResponseDto(
  value: unknown
): value is StartLuckyMeadowSnapshotResponseDto {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === "string" && typeof value.resumed === "boolean";
}

export function isOpenLuckyMeadowCellResponseDto(value: unknown): value is OpenLuckyMeadowCellResponseDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isCellPosition(value.position) &&
    isCellOutcomeDto(value.outcome) &&
    (value.status === "active" || value.status === "finished") &&
    isOptionalNumber(value.jackpotCount) &&
    isOptionalNumber(value.semiJackpotCount) &&
    (value.prize === undefined || isPrizeDto(value.prize)) &&
    (value.prizeStatus === undefined || value.prizeStatus === "jackpot_unavailable")
  );
}
