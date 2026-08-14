import { useMutation } from "@tanstack/react-query";

import { updateCrackSafeRule } from "../api/update-crack-safe-rule";
import { type UpdateCrackSafeRuleVariables } from "../api/types";

export function useUpdateCrackSafeRule() {
  return useMutation({
    mutationFn: ({ startDate, payload }: UpdateCrackSafeRuleVariables) =>
      updateCrackSafeRule(startDate, payload)
  });
}
