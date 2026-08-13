import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type UpdateLuckyMeadowRulePayload } from "../api/types";
import { updateLuckyMeadowRule } from "../api/update-lucky-meadow-rule";
import { luckyMeadowRulesQueryKey } from "./lucky-meadow-rules-query";

export function useUpdateLuckyMeadowRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLuckyMeadowRulePayload) => updateLuckyMeadowRule(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: luckyMeadowRulesQueryKey });
    }
  });
}
