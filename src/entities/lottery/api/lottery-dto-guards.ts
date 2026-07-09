import {
  type LotteryAttemptNoSpendReasonDto,
  type LotteryAttemptOutcomeDto,
  type LotteryAttemptPrizeDataDto,
  type LotteryAttemptPrizeDto,
  type LotteryAttemptResponseDto,
  type LotteryAttemptWalletDto,
  type LotteryAvailabilityResponseDto
} from "./types";

const ATTEMPT_OUTCOMES = new Set<LotteryAttemptOutcomeDto>(["jackpot", "lose", "semi_jackpot"]);

const NO_SPEND_REASONS = new Set<LotteryAttemptNoSpendReasonDto>([
  "game_finished",
  "jackpot_already_won",
  "no_rules",
  "semi_jackpot_already_won",
  "user_jackpot_already_won"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isOptionalNullableString(value: unknown): value is string | null | undefined {
  return value === null || value === undefined || typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isLotteryAttemptNoSpendReasonDto(value: unknown): value is LotteryAttemptNoSpendReasonDto {
  return typeof value === "string" && NO_SPEND_REASONS.has(value as LotteryAttemptNoSpendReasonDto);
}

export function isLotteryAttemptWalletDto(value: unknown): value is LotteryAttemptWalletDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.isChannelBonusGranted === "boolean" &&
    typeof value.notExpiredAttempts === "number" &&
    typeof value.todayAttempts === "number" &&
    typeof value.version === "number"
  );
}

function isLotteryAttemptPrizeDataDto(value: unknown): value is LotteryAttemptPrizeDataDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNullableString(value.description) &&
    isRecord(value.metadata) &&
    typeof value.name === "string" &&
    typeof value.promoCode === "string"
  );
}

export function isLotteryAttemptPrizeDto(value: unknown): value is LotteryAttemptPrizeDto {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === "string" && isLotteryAttemptPrizeDataDto(value.prizeData);
}

function isNullableLotteryAttemptPrizeDto(value: unknown): value is LotteryAttemptPrizeDto | null {
  return value === null || isLotteryAttemptPrizeDto(value);
}

export function isLotteryAttemptResponseDto(value: unknown): value is LotteryAttemptResponseDto {
  if (!isRecord(value) || typeof value.message !== "string") {
    return false;
  }

  if (value.attemptSpent === false) {
    return isLotteryAttemptNoSpendReasonDto(value.reason);
  }

  if (value.attemptSpent !== true) {
    return false;
  }

  return (
    typeof value.outcome === "string" &&
    ATTEMPT_OUTCOMES.has(value.outcome as LotteryAttemptOutcomeDto) &&
    isLotteryAttemptWalletDto(value.wallet) &&
    (value.prize === undefined || isLotteryAttemptPrizeDto(value.prize))
  );
}

export function isLotteryAvailabilityResponseDto(value: unknown): value is LotteryAvailabilityResponseDto {
  if (!isRecord(value) || typeof value.canPlay !== "boolean") {
    return false;
  }

  return (
    isStringArray(value.enteredCodes) &&
    isOptionalNullableString(value.message) &&
    "prize" in value &&
    isNullableLotteryAttemptPrizeDto(value.prize)
  );
}
