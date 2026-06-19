import { type QueryClient } from "@tanstack/react-query";

import { type MeDto } from "../api/types";
import { mapMeDtoToMe } from "../lib/map-me-dto-to-me";
import { normalizeMeDto } from "../lib/normalize-me-dto";
import { type Me } from "./types";

export const meQueryKey = ["me"] as const;

export function setMeQueryData(queryClient: QueryClient, dto: MeDto): Me {
  const meDto = normalizeMeDto(dto);

  queryClient.setQueryData(meQueryKey, meDto);

  return mapMeDtoToMe(meDto);
}
