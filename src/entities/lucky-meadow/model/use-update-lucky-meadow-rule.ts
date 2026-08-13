import { useMutation } from "@tanstack/react-query";

import { type UpdateLuckyMeadowRulePayload } from "../api/types";
import { updateLuckyMeadowRule } from "../api/update-lucky-meadow-rule";

export function useUpdateLuckyMeadowRule() {
  return useMutation({
    mutationFn: (payload: UpdateLuckyMeadowRulePayload) => updateLuckyMeadowRule(payload)
  });
}
