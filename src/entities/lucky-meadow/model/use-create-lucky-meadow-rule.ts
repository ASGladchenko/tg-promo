import { useMutation } from "@tanstack/react-query";

import { createLuckyMeadowRule } from "../api/create-lucky-meadow-rule";
import { type CreateLuckyMeadowRulePayload } from "../api/types";

export function useCreateLuckyMeadowRule() {
  return useMutation({
    mutationFn: (payload: CreateLuckyMeadowRulePayload) => createLuckyMeadowRule(payload)
  });
}
