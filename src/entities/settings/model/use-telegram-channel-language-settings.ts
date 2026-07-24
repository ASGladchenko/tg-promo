import { useQuery } from "@tanstack/react-query";

import { getTelegramChannelLanguageSettingsDto } from "../api/get-telegram-channel-language-settings";
import { telegramChannelLanguageSettingsQueryKey } from "./settings-query";

export function useTelegramChannelLanguageSettings() {
  return useQuery({
    queryKey: telegramChannelLanguageSettingsQueryKey,
    queryFn: ({ signal }) => getTelegramChannelLanguageSettingsDto(signal)
  });
}
