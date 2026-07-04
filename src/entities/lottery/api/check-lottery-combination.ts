import { getApiUrl } from "@/shared/api";

import { mapLotteryAttemptDtoToLotteryAttemptResult } from "../lib/map-lottery-attempt-dto-to-lottery-attempt-result";
import { type LotteryAttemptResult } from "../model/types";
import {
  type LotteryAttemptNoSpendReasonDto,
  type LotteryAttemptOutcomeDto,
  type LotteryAttemptPrizeDataDto,
  type LotteryAttemptResponseDto,
  type LotteryAttemptWalletDto
} from "./types";

type LotteryCombinationPayload = {
  digits: string;
};

const ATTEMPT_OUTCOMES = new Set<LotteryAttemptOutcomeDto>(["jackpot", "lose", "semi_jackpot"]);

const NO_SPEND_REASONS = new Set<LotteryAttemptNoSpendReasonDto>([
  "game_finished",
  "jackpot_already_won",
  "no_rules",
  "semi_jackpot_already_won"
]);

function createCombinationPayload(digits: string[]): LotteryCombinationPayload {
  return {
    digits: digits.join("")
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isWalletDto(value: unknown): value is LotteryAttemptWalletDto {
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

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isPrizeDataDto(value: unknown): value is LotteryAttemptPrizeDataDto {
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

function isPrizeDto(
  value: unknown
): value is NonNullable<Extract<LotteryAttemptResponseDto, { attemptSpent: true }>["prize"]> {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === "string" && isPrizeDataDto(value.prizeData);
}

function isLotteryAttemptResponseDto(value: unknown): value is LotteryAttemptResponseDto {
  if (!isRecord(value) || typeof value.message !== "string") {
    return false;
  }

  if (value.attemptSpent === false) {
    return (
      typeof value.reason === "string" &&
      NO_SPEND_REASONS.has(value.reason as LotteryAttemptNoSpendReasonDto)
    );
  }

  if (value.attemptSpent !== true) {
    return false;
  }

  return (
    typeof value.outcome === "string" &&
    ATTEMPT_OUTCOMES.has(value.outcome as LotteryAttemptOutcomeDto) &&
    isWalletDto(value.wallet) &&
    (value.prize === undefined || isPrizeDto(value.prize))
  );
}

export async function checkLotteryCombination(
  digits: string[],
  signal?: AbortSignal
): Promise<LotteryAttemptResult> {
  const response = await fetch(getApiUrl("crack-safe/attempt"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createCombinationPayload(digits)),
    signal
  });

  if (!response.ok) {
    throw new Error(`Lottery check failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isLotteryAttemptResponseDto(dto)) {
    throw new Error("Lottery check returned invalid payload");
  }

  return mapLotteryAttemptDtoToLotteryAttemptResult(dto);
}
