import {
  type LotteryAttemptNoSpendReasonDto,
  type LotteryAttemptOutcomeDto,
  type LotteryAttemptResponseDto
} from "../api/types";
import {
  type LotteryAttemptNoSpendReason,
  type LotteryAttemptOutcome,
  type LotteryAttemptPrize,
  type LotteryAttemptResult
} from "../model/types";

const outcomeMap: Record<LotteryAttemptOutcomeDto, LotteryAttemptOutcome> = {
  jackpot: "jackpot",
  lose: "lose",
  semi_jackpot: "semiJackpot"
};

const noSpendReasonMap: Record<LotteryAttemptNoSpendReasonDto, LotteryAttemptNoSpendReason> = {
  game_finished: "gameFinished",
  jackpot_already_won: "jackpotAlreadyWon",
  no_rules: "noRules",
  semi_jackpot_already_won: "semiJackpotAlreadyWon"
};

function getOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function mapPrize(dto: LotteryAttemptResponseDto): LotteryAttemptPrize | undefined {
  if (!dto.attemptSpent || !dto.prize) {
    return undefined;
  }

  return {
    description: getOptionalString(dto.prize.prizeData.description),
    id: dto.prize.id,
    name: getOptionalString(dto.prize.prizeData.name),
    promoCode: getOptionalString(dto.prize.prizeData.promoCode)
  };
}

export function mapLotteryAttemptDtoToLotteryAttemptResult(
  dto: LotteryAttemptResponseDto
): LotteryAttemptResult {
  if (!dto.attemptSpent) {
    return {
      attemptSpent: false,
      message: dto.message,
      reason: noSpendReasonMap[dto.reason]
    };
  }

  return {
    attemptSpent: true,
    message: dto.message,
    outcome: outcomeMap[dto.outcome],
    prize: mapPrize(dto),
    wallet: {
      isChannelBonusGranted: dto.wallet.isChannelBonusGranted,
      notExpiredAttempts: dto.wallet.notExpiredAttempts,
      todayAttempts: dto.wallet.todayAttempts,
      version: dto.wallet.version
    }
  };
}
