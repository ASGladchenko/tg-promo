import {
  type TelegramChannelLanguageSettingsResponseDto,
  type WalletAttemptRewardsSettingsResponseDto
} from "../api/types";

export type TelegramChannelLanguage = TelegramChannelLanguageSettingsResponseDto["language"];
export type TelegramChannelLanguageSettings = TelegramChannelLanguageSettingsResponseDto;
export type WalletAttemptRewardsSettings = WalletAttemptRewardsSettingsResponseDto;
