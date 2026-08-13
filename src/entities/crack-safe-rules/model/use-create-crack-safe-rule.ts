import { useMutation } from "@tanstack/react-query";

import { createCrackSafeRule } from "../api/create-crack-safe-rule";
import { type CreateCrackSafeRulePayload } from "../api/types";

export function useCreateCrackSafeRule() {
  return useMutation({
    mutationFn: (payload: CreateCrackSafeRulePayload) => createCrackSafeRule(payload)
  });
}
