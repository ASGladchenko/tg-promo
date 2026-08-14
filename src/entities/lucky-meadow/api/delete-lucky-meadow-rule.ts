import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

export async function deleteLuckyMeadowRule(startDate: string, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl(`lucky-meadow/rules/${encodeURIComponent(startDate)}`), {
    method: "DELETE",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Delete Lucky Meadow rule request failed with status ${response.status}`
      )
    );
  }
}
