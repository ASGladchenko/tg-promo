import { type LotteryAttemptOutcomeDto, type LotteryAttemptResponseDto } from "../api/types";
import { type LotteryAttemptOutcome, type LotteryAttemptResult } from "../model/types";
import { mapLotteryAttemptNoSpendReasonDtoToLotteryAttemptNoSpendReason } from "./map-lottery-attempt-no-spend-reason-dto-to-lottery-attempt-no-spend-reason";
import { mapLotteryPrizeDtoToLotteryAttemptPrize } from "./map-lottery-prize-dto-to-lottery-attempt-prize";

const outcomeMap: Record<LotteryAttemptOutcomeDto, LotteryAttemptOutcome> = {
  jackpot: "jackpot",
  lose: "lose",
  semi_jackpot: "semiJackpot"
};

function mapPrize(dto: LotteryAttemptResponseDto) {
  if (!dto.attemptSpent || !dto.prize) {
    return undefined;
  }

  return mapLotteryPrizeDtoToLotteryAttemptPrize(dto.prize);
}

export function mapLotteryAttemptDtoToLotteryAttemptResult(
  dto: LotteryAttemptResponseDto
): LotteryAttemptResult {
  if (!dto.attemptSpent) {
    return {
      attemptSpent: false,
      message: dto.message,
      reason: mapLotteryAttemptNoSpendReasonDtoToLotteryAttemptNoSpendReason(dto.reason)
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
