import * as z from "zod";

import { type WalletAttemptRewardsSettings } from "@/entities/settings";

const attemptRewardFormValueSchema = z
  .string()
  .trim()
  .min(1, "Attempt reward is required")
  .regex(/^\d+$/, "Attempt reward must be an integer")
  .refine((value) => Number(value) >= 1, "Attempt reward must be at least 1")
  .refine((value) => Number(value) <= 1000, "Attempt reward must be at most 1000");

export const adminAttemptRewardsFormSchema = z
  .object({
    channelSubscriptionAttempts: attemptRewardFormValueSchema,
    dailyAttempts: attemptRewardFormValueSchema,
    phoneConfirmationAttempts: attemptRewardFormValueSchema,
    referralFirstPlayAttempts: attemptRewardFormValueSchema
  })
  .transform(
    (values): WalletAttemptRewardsSettings => ({
      channelSubscriptionAttempts: Number(values.channelSubscriptionAttempts),
      dailyAttempts: Number(values.dailyAttempts),
      phoneConfirmationAttempts: Number(values.phoneConfirmationAttempts),
      referralFirstPlayAttempts: Number(values.referralFirstPlayAttempts)
    })
  );

export type AdminAttemptRewardsFormState = z.input<typeof adminAttemptRewardsFormSchema>;
