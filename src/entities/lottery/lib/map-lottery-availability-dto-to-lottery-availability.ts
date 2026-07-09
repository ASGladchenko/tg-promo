import { type LotteryAvailabilityResponseDto } from "../api/types";
import { type LotteryAvailability } from "../model/types";
import { mapLotteryPrizeDtoToLotteryAttemptPrize } from "./map-lottery-prize-dto-to-lottery-attempt-prize";

function getMessage(dto: LotteryAvailabilityResponseDto): string | null {
  const message = dto.message?.trim();

  return message ? message : null;
}

function getPrize(dto: LotteryAvailabilityResponseDto) {
  return dto.prize ? mapLotteryPrizeDtoToLotteryAttemptPrize(dto.prize) : undefined;
}

export function mapLotteryAvailabilityDtoToLotteryAvailability(
  dto: LotteryAvailabilityResponseDto
): LotteryAvailability {
  return {
    enteredCodes: [...dto.enteredCodes],
    isAvailable: dto.canPlay,
    message: getMessage(dto),
    prize: getPrize(dto)
  };
}
