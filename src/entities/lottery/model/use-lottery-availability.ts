import { useQuery } from "@tanstack/react-query";

import { getLotteryAvailabilityDto } from "../api/get-lottery-availability";
import { mapLotteryAvailabilityDtoToLotteryAvailability } from "../lib/map-lottery-availability-dto-to-lottery-availability";
import { lotteryAvailabilityQueryKey } from "./lottery-availability-query";

type UseLotteryAvailabilityOptions = {
  enabled?: boolean;
};

export function useLotteryAvailability({ enabled = true }: UseLotteryAvailabilityOptions = {}) {
  return useQuery({
    queryKey: lotteryAvailabilityQueryKey,
    queryFn: ({ signal }) => getLotteryAvailabilityDto(signal),
    select: mapLotteryAvailabilityDtoToLotteryAvailability,
    enabled
  });
}
