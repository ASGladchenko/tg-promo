import { getLocalizedMetadataString } from "@/shared/lib/i18n";

import { type MyPrizesResponseDto } from "../api/types";
import { type UserPrize, type UserPrizeOutcome } from "../model/types";

function getOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function mapUserPrizeOutcome(value: unknown): UserPrizeOutcome | null {
  if (value === "jackpot") {
    return "jackpot";
  }

  if (value === "semi_jackpot" || value === "semiJackpot" || value === "semi-pot" || value === "semiPot") {
    return "semiJackpot";
  }

  return null;
}

export function mapUserPrizesDtoToUserPrizes(dto: MyPrizesResponseDto): UserPrize[] {
  return dto.map((userPrize) => ({
    ...userPrize,
    description: getLocalizedMetadataString(
      userPrize.prizeData,
      undefined,
      userPrize.prizeData.description
    ),
    outcome: mapUserPrizeOutcome(userPrize.prizeData.outcome ?? userPrize.outcome),
    prizeData: { ...userPrize.prizeData },
    promoCode: getOptionalString(userPrize.prizeData.promoCode)
  }));
}
