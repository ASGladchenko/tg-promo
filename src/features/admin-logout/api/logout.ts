import { getApiUrl } from "@/shared/api";

export async function logoutAdmin(signal?: AbortSignal): Promise<void> {
  const response = await fetch(getApiUrl("auth/logout"), {
    method: "POST",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Admin logout request failed with status ${response.status}`);
  }
}
