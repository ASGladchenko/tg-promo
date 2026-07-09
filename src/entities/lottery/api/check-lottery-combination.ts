import { getApiUrl } from "@/shared/api";

import { mapLotteryAttemptDtoToLotteryAttemptResult } from "../lib/map-lottery-attempt-dto-to-lottery-attempt-result";
import { type LotteryAttemptResult } from "../model/types";
import { isLotteryAttemptResponseDto } from "./lottery-dto-guards";

type LotteryCombinationPayload = {
  digits: string;
};

function createCombinationPayload(digits: string[]): LotteryCombinationPayload {
  return {
    digits: digits.join("")
  };
}

export async function checkLotteryCombination(
  digits: string[],
  signal?: AbortSignal
): Promise<LotteryAttemptResult> {
  const response = await fetch(getApiUrl("crack-safe/attempt"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createCombinationPayload(digits)),
    signal
  });

  if (!response.ok) {
    throw new Error(`Lottery check failed with status ${response.status}`);
  }

  const dto: unknown = await response.json();

  if (!isLotteryAttemptResponseDto(dto)) {
    throw new Error("Lottery check returned invalid payload");
  }

  return mapLotteryAttemptDtoToLotteryAttemptResult(dto);
}
