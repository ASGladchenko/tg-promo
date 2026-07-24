import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateTelegramChannelLanguage } from "../api/update-telegram-channel-language";
import { type UpdateTelegramChannelLanguagePayload } from "../api/types";
import { telegramChannelLanguageSettingsQueryKey } from "./settings-query";

export function useUpdateTelegramChannelLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTelegramChannelLanguagePayload) => updateTelegramChannelLanguage(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(telegramChannelLanguageSettingsQueryKey, settings);
    }
  });
}
