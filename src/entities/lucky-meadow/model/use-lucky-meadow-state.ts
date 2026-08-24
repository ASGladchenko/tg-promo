import { useQuery } from "@tanstack/react-query";

import { getLuckyMeadowStateDto } from "../api/get-lucky-meadow-state";
import { mapLuckyMeadowStateDtoToLuckyMeadowState } from "../lib/map-lucky-meadow-dto-to-lucky-meadow";
import { luckyMeadowStateQueryKey } from "./lucky-meadow-query";

export function useLuckyMeadowState() {
  return useQuery({
    queryKey: luckyMeadowStateQueryKey,
    queryFn: ({ signal }) => getLuckyMeadowStateDto(signal),
    select: mapLuckyMeadowStateDtoToLuckyMeadowState
  });
}
