import { type LotteryAttemptPrizeDto } from "../api/types";
import { type LotteryAttemptPrize } from "../model/types";

function getOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function mapLotteryPrizeDtoToLotteryAttemptPrize(dto: LotteryAttemptPrizeDto): LotteryAttemptPrize {
  return {
    description: getOptionalString(dto.prizeData.description),
    id: dto.id,
    name: getOptionalString(dto.prizeData.name),
    promoCode: getOptionalString(dto.prizeData.promoCode)
  };
}
