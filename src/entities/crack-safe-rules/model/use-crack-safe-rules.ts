import { useQuery } from "@tanstack/react-query";

import { getCrackSafeRulesDto } from "../api/get-crack-safe-rules";
import { mapCrackSafeRulesDtoToCrackSafeRules } from "../lib/map-crack-safe-rules-dto-to-crack-safe-rules";
import { crackSafeRulesQueryKey } from "./crack-safe-rules-query";

export function useCrackSafeRules() {
  return useQuery({
    queryKey: crackSafeRulesQueryKey,
    queryFn: ({ signal }) => getCrackSafeRulesDto(signal),
    select: mapCrackSafeRulesDtoToCrackSafeRules
  });
}
