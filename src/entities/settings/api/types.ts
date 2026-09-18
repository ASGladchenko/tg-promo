import { type z } from "zod";

import { telegramChannelLanguageSettingsResponseDtoSchema } from "./telegram-channel-language-settings-response-schema";
import { walletAttemptRewardsSettingsResponseDtoSchema } from "./wallet-attempt-rewards-settings-response-schema";

export type TelegramChannelLanguageSettingsResponseDto = z.output<
  typeof telegramChannelLanguageSettingsResponseDtoSchema
>;

export type UpdateTelegramChannelLanguagePayload = Pick<
  TelegramChannelLanguageSettingsResponseDto,
  "language"
>;

export type WalletAttemptRewardsSettingsResponseDto = z.output<
  typeof walletAttemptRewardsSettingsResponseDtoSchema
>;

export type UpdateWalletAttemptRewardsSettingsPayload = WalletAttemptRewardsSettingsResponseDto;
