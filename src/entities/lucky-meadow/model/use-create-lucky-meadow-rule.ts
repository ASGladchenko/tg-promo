import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createLuckyMeadowRule } from "../api/create-lucky-meadow-rule";
import { type CreateLuckyMeadowRulePayload } from "../api/types";
import { luckyMeadowRulesQueryKey } from "./lucky-meadow-rules-query";

export function useCreateLuckyMeadowRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLuckyMeadowRulePayload) => createLuckyMeadowRule(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: luckyMeadowRulesQueryKey });
    }
  });
}
