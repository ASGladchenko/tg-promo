import { getApiUrl } from "@/shared/api";

type LotteryCombinationPayload = {
  "1": string;
  "2": string;
  "3": string;
};

function createCombinationPayload(digits: string[]): LotteryCombinationPayload {
  return {
    "1": digits[0] ?? "",
    "2": digits[1] ?? "",
    "3": digits[2] ?? "",
  };
}

export async function checkLotteryCombination(
  digits: string[],
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(getApiUrl("lottery/check"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createCombinationPayload(digits)),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Lottery check failed with status ${response.status}`);
  }
}
