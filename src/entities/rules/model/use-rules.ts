import { useQuery } from "@tanstack/react-query";

import { getRulesDto } from "../api/get-rules";
import { mapRulesDtoToRules } from "../lib/map-rules-dto-to-rules";
import { rulesQueryKey } from "./rules-query";

export function useRules() {
  return useQuery({
    queryKey: rulesQueryKey,
    queryFn: ({ signal }) => getRulesDto(signal),
    select: mapRulesDtoToRules
  });
}
