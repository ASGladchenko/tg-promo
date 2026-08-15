import { useQuery } from "@tanstack/react-query";

import { getLuckyMeadowRule } from "../api/get-lucky-meadow-rule";
import { luckyMeadowRuleQueryKey } from "./lucky-meadow-rule-query";

export function useLuckyMeadowRule(startDate: string, isEnabled: boolean) {
  return useQuery({
    enabled: isEnabled,
    gcTime: 0,
    queryKey: luckyMeadowRuleQueryKey(startDate),
    queryFn: ({ signal }) => getLuckyMeadowRule(startDate, signal),
    refetchOnWindowFocus: true
  });
}
