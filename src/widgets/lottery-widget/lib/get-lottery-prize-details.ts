import { type LotteryAttemptPrize } from "@/entities/lottery";

export type LotteryPrizeDetails = {
  description: string | null;
  promoCode: string | null;
};

export function getLotteryPrizeDetails(prize?: LotteryAttemptPrize): LotteryPrizeDetails {
  return {
    description: prize?.description ?? null,
    promoCode: prize?.promoCode ?? null
  };
}
