import { useMutation } from "@tanstack/react-query";

import { deleteLuckyMeadowRule } from "../api/delete-lucky-meadow-rule";

export function useDeleteLuckyMeadowRule() {
  return useMutation({
    mutationFn: (startDate: string) => deleteLuckyMeadowRule(startDate)
  });
}
