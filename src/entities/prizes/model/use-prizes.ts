import { useQuery } from "@tanstack/react-query";

import { getPrizesDto } from "../api/get-prizes";
import { mapPrizesDtoToPrizes } from "../lib/map-prizes-dto-to-prizes";
import { prizesQueryKey } from "./prizes-query";

export function usePrizes() {
  return useQuery({
    queryKey: prizesQueryKey,
    queryFn: ({ signal }) => getPrizesDto(signal),
    select: mapPrizesDtoToPrizes
  });
}
