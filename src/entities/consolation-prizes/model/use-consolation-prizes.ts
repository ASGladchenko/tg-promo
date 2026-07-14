import { useQuery } from "@tanstack/react-query";

import { getConsolationPrizesDto } from "../api/get-consolation-prizes";
import { mapConsolationPrizesDtoToConsolationPrizes } from "../lib/map-consolation-prizes-dto-to-consolation-prizes";
import { consolationPrizesQueryKey } from "./consolation-prizes-query";

export function useConsolationPrizes() {
  return useQuery({
    queryKey: consolationPrizesQueryKey,
    queryFn: ({ signal }) => getConsolationPrizesDto(signal),
    select: mapConsolationPrizesDtoToConsolationPrizes
  });
}
