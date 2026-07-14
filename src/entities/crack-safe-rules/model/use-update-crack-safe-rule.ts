import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCrackSafeRule } from "../api/update-crack-safe-rule";
import { type UpdateCrackSafeRuleVariables } from "../api/types";
import { crackSafeRulesQueryKey } from "./crack-safe-rules-query";

export function useUpdateCrackSafeRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, payload }: UpdateCrackSafeRuleVariables) => updateCrackSafeRule(date, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crackSafeRulesQueryKey });
    }
  });
}
