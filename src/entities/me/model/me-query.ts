import { type QueryClient } from "@tanstack/react-query";

import { type MeDto } from "../api/types";
import { mapMeDtoToMe } from "../lib/map-me-dto-to-me";
import { normalizeMeDto } from "../lib/normalize-me-dto";
import { type Me } from "./types";

export const meQueryKey = ["me"] as const;

export type MeQueryPatch = Partial<
  Pick<
    MeDto,
    "email" | "imgUrl" | "isChannelSubscribed" | "login" | "name" | "phone" | "provider" | "roles" | "surname"
  >
>;

export function setMeQueryData(queryClient: QueryClient, dto: MeDto): Me {
  const meDto = normalizeMeDto(dto);

  queryClient.setQueryData(meQueryKey, meDto);

  return mapMeDtoToMe(meDto);
}

export function patchMeQueryData(queryClient: QueryClient, patch: MeQueryPatch): Me | null {
  const currentDto = queryClient.getQueryData<MeDto>(meQueryKey);

  if (!currentDto) {
    return null;
  }

  const meDto = normalizeMeDto({
    ...currentDto,
    ...patch
  });

  queryClient.setQueryData(meQueryKey, meDto);

  return mapMeDtoToMe(meDto);
}
