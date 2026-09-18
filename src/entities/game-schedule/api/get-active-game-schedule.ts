import { getApiUrl } from "@/shared/api";
import { formatZodError } from "@/shared/lib/error";

import { activeGameScheduleResponseDtoSchema } from "./game-schedules-response-schema";
import { type ActiveGameScheduleResponseDto } from "./types";

export async function getActiveGameSchedule(signal?: AbortSignal): Promise<ActiveGameScheduleResponseDto> {
  const response = await fetch(getApiUrl("game-schedules/active"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Active game schedule request failed with status ${response.status}`);
  }

  const parsedResponse = activeGameScheduleResponseDtoSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error(formatZodError(parsedResponse.error, "Active game schedule response has invalid format"));
  }

  return parsedResponse.data;
}
