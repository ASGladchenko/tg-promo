import { useQuery } from "@tanstack/react-query";

import { getConsolationPrizesDto } from "../api/get-consolation-prizes";
import { consolationPrizesQueryKey } from "./consolation-prizes-query";

export function useConsolationPrizes() {
  return useQuery({
    queryKey: consolationPrizesQueryKey,
    queryFn: ({ signal }) => getConsolationPrizesDto(signal)
  });
}
