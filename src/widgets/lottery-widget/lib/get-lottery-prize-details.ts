import { type LotteryAttemptPrize } from "@/entities/lottery";
import { getLocalizedMetadataString } from "@/shared/lib/i18n";

export type LotteryPrizeDetails = {
  description: string | null;
  promoCode: string | null;
};

export function getLotteryPrizeDetails(
  prize: LotteryAttemptPrize | undefined,
  locale: string | undefined
): LotteryPrizeDetails {
  return {
    description: getLocalizedMetadataString(prize?.metadata, locale, prize?.description),
    promoCode: prize?.promoCode ?? null
  };
}
