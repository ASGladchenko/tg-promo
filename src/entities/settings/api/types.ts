import { type z } from "zod";

import { telegramChannelLanguageSettingsResponseDtoSchema } from "./telegram-channel-language-settings-response-schema";

export type TelegramChannelLanguageSettingsResponseDto = z.output<
  typeof telegramChannelLanguageSettingsResponseDtoSchema
>;

export type UpdateTelegramChannelLanguagePayload = Pick<
  TelegramChannelLanguageSettingsResponseDto,
  "language"
>;
