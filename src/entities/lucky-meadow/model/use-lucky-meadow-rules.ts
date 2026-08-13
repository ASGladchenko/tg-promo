import { useQuery } from "@tanstack/react-query";

import { getLuckyMeadowRulesDto } from "../api/get-lucky-meadow-rules";
import { luckyMeadowRulesQueryKey } from "./lucky-meadow-rules-query";

export function useLuckyMeadowRules() {
  return useQuery({
    queryKey: luckyMeadowRulesQueryKey,
    queryFn: ({ signal }) => getLuckyMeadowRulesDto(signal)
  });
}
