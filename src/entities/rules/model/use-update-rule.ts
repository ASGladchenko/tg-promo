import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRule } from "../api/update-rule";
import { type UpdateRuleVariables } from "../api/types";
import { rulesQueryKey } from "./rules-query";

export function useUpdateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, payload }: UpdateRuleVariables) => updateRule(date, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    }
  });
}
