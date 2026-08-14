import { useMutation } from "@tanstack/react-query";

import { type UpdateLuckyMeadowRuleVariables } from "../api/types";
import { updateLuckyMeadowRule } from "../api/update-lucky-meadow-rule";

export function useUpdateLuckyMeadowRule() {
  return useMutation({
    mutationFn: ({ startDate, payload }: UpdateLuckyMeadowRuleVariables) =>
      updateLuckyMeadowRule(startDate, payload)
  });
}
