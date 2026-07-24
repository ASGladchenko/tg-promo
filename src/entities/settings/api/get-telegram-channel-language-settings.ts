import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { telegramChannelLanguageSettingsResponseDtoSchema } from "./telegram-channel-language-settings-response-schema";
import { type TelegramChannelLanguageSettingsResponseDto } from "./types";

export async function getTelegramChannelLanguageSettingsDto(
  signal?: AbortSignal
): Promise<TelegramChannelLanguageSettingsResponseDto> {
  const response = await fetch(getApiUrl("settings/telegram/channel-language"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Telegram channel language settings request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = telegramChannelLanguageSettingsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Telegram channel language settings response has invalid format")
    );
  }

  return parsedResponse.data;
}
