import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCrackSafeRule } from "../api/create-crack-safe-rule";
import { type CreateCrackSafeRulePayload } from "../api/types";
import { crackSafeRulesQueryKey } from "./crack-safe-rules-query";

export function useCreateCrackSafeRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCrackSafeRulePayload) => createCrackSafeRule(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crackSafeRulesQueryKey });
    }
  });
}
