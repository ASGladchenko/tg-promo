import { useMutation } from "@tanstack/react-query";

import { deleteCrackSafeRule } from "../api/delete-crack-safe-rule";

export function useDeleteCrackSafeRule() {
  return useMutation({
    mutationFn: (startDate: string) => deleteCrackSafeRule(startDate)
  });
}
