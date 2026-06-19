import { useQuery } from "@tanstack/react-query";

import { getMeDto } from "../api/me-api";
import { mapMeDtoToMe } from "../lib/map-me-dto-to-me";
import { meQueryKey } from "./me-query";

type UseMeOptions = {
  enabled?: boolean;
};

export function useMe(options: UseMeOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: meQueryKey,
    queryFn: ({ signal }) => getMeDto(signal),
    select: mapMeDtoToMe,
    enabled
  });
}
