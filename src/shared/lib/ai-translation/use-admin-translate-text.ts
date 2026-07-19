import { useMutation } from "@tanstack/react-query";

import { type AiTranslateTextPayload } from "./ai-translation-schemas";
import { translateText } from "./translate-text";

export function useAdminTranslateText() {
  return useMutation({
    mutationFn: (payload: AiTranslateTextPayload) => translateText(payload)
  });
}
