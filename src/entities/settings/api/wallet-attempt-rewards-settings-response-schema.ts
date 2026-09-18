import * as z from "zod";

const walletAttemptRewardSchema = z.number().int().min(1).max(1000);

export const walletAttemptRewardsSettingsResponseDtoSchema = z.object({
  channelSubscriptionAttempts: walletAttemptRewardSchema,
  dailyAttempts: walletAttemptRewardSchema,
  phoneConfirmationAttempts: walletAttemptRewardSchema,
  referralFirstPlayAttempts: walletAttemptRewardSchema
});
