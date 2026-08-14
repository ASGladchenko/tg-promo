import { getApiUrl } from "@/shared/api";
import { readResponseErrorMessage } from "@/shared/lib/error";

export async function deleteCrackSafeRule(startDate: string, signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl(`crack-safe/rules/${encodeURIComponent(startDate)}`), {
    method: "DELETE",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(
      await readResponseErrorMessage(
        response,
        `Delete Crack Safe rule request failed with status ${response.status}`
      )
    );
  }
}
