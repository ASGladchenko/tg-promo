import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRule } from "../api/create-rule";
import { type CreateRulePayload } from "../api/types";
import { rulesQueryKey } from "./rules-query";

export function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRulePayload) => createRule(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    }
  });
}
