import { getApiUrl } from "@/shared/api";
import { formatZodError, readResponseErrorMessage } from "@/shared/lib/error";

import { telegramChannelLanguageSettingsResponseDtoSchema } from "./telegram-channel-language-settings-response-schema";
import {
  type TelegramChannelLanguageSettingsResponseDto,
  type UpdateTelegramChannelLanguagePayload
} from "./types";

export async function updateTelegramChannelLanguage(
  payload: UpdateTelegramChannelLanguagePayload,
  signal?: AbortSignal
): Promise<TelegramChannelLanguageSettingsResponseDto> {
  const response = await fetch(getApiUrl("settings/telegram/channel-language"), {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Update Telegram channel language request failed with status ${response.status}`
      )
    );
  }

  const parsedResponse = telegramChannelLanguageSettingsResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(
      formatZodError(parsedResponse.error, "Update Telegram channel language response has invalid format")
    );
  }

  return parsedResponse.data;
}
