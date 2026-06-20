import { getApiUrl } from "@/shared/api";

import { normalizeMeDto } from "../lib/normalize-me-dto";
import { type MeDto } from "./types";

type AuthMeResponseDto = MeDto & {
  wallet?: unknown;
};

function pickMeDto(dto: AuthMeResponseDto): MeDto {
  return normalizeMeDto(dto);
}

export async function getMeDto(signal?: AbortSignal): Promise<MeDto> {
  const response = await fetch(getApiUrl("auth/me"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Me request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AuthMeResponseDto;
  return pickMeDto(payload);
}
