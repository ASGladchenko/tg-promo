import { getApiUrl } from "@/shared/api";

import { type AuthenticateViewerResponseDto } from "./authenticate-viewer";

export async function authenticateDevViewer(
  signal?: AbortSignal
): Promise<AuthenticateViewerResponseDto> {
  const response = await fetch(getApiUrl("auth/dev-login"), {
    method: "POST",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Dev auth request failed with status ${response.status}`);
  }

  return response.json() as Promise<AuthenticateViewerResponseDto>;
}
