import { useQuery } from "@tanstack/react-query";

import { getCrackSafeRule } from "../api/get-crack-safe-rule";
import { crackSafeRuleQueryKey } from "./crack-safe-rule-query";

export function useCrackSafeRule(startDate: string, isEnabled: boolean) {
  return useQuery({
    enabled: isEnabled,
    gcTime: 0,
    queryKey: crackSafeRuleQueryKey(startDate),
    queryFn: ({ signal }) => getCrackSafeRule(startDate, signal),
    refetchOnWindowFocus: true
  });
}
