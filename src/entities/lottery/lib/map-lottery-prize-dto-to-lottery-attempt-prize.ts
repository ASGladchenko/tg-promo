import { getLocalizedMetadataString } from "@/shared/lib/i18n";

import { type LotteryAttemptPrizeDto } from "../api/types";
import { type LotteryAttemptPrize } from "../model/types";

function getOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function mapLotteryPrizeDtoToLotteryAttemptPrize(dto: LotteryAttemptPrizeDto): LotteryAttemptPrize {
  return {
    description: getLocalizedMetadataString(dto.prizeData.metadata, undefined, dto.prizeData.description),
    id: dto.id,
    metadata: { ...dto.prizeData.metadata },
    name: getOptionalString(dto.prizeData.name),
    promoCode: getOptionalString(dto.prizeData.promoCode)
  };
}
