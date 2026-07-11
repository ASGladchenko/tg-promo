import { useQuery } from "@tanstack/react-query";

import { getMyPrizesDto } from "../api/get-my-prizes";
import { mapUserPrizesDtoToUserPrizes } from "../lib/map-user-prizes-dto-to-user-prizes";
import { myPrizesQueryKey } from "./prizes-query";

type UseMyPrizesOptions = {
  enabled?: boolean;
};

export function useMyPrizes({ enabled = true }: UseMyPrizesOptions = {}) {
  return useQuery({
    queryKey: myPrizesQueryKey,
    queryFn: ({ signal }) => getMyPrizesDto(signal),
    select: mapUserPrizesDtoToUserPrizes,
    enabled
  });
}
