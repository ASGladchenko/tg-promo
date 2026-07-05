import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTodayRule } from "../api/create-today-rule";
import { type CreateTodayRulePayload } from "../api/types";
import { rulesQueryKey } from "./rules-query";

export function useCreateTodayRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodayRulePayload) => createTodayRule(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: rulesQueryKey });
    }
  });
}
