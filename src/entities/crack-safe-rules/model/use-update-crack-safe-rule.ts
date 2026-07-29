import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCrackSafeRule } from "../api/update-crack-safe-rule";
import { type UpdateCrackSafeRuleVariables } from "../api/types";
import { crackSafeRulesQueryKey } from "./crack-safe-rules-query";

export function useUpdateCrackSafeRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ startDate, payload }: UpdateCrackSafeRuleVariables) =>
      updateCrackSafeRule(startDate, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: crackSafeRulesQueryKey });
    }
  });
}
