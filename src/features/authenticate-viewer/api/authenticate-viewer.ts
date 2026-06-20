import { type AttemptsWalletDto } from "@/entities/attempts";
import { type MeDto } from "@/entities/me";
import { getApiUrl } from "@/shared/api";

export type AuthenticateViewerPayload = {
  initData: string;
};

export type AuthenticateViewerResponseDto = MeDto & {
  wallet: AttemptsWalletDto;
};

export async function authenticateViewer(
  payload: AuthenticateViewerPayload,
  signal?: AbortSignal
): Promise<AuthenticateViewerResponseDto> {
  const response = await fetch(getApiUrl("auth/telegram"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  return response.json() as Promise<AuthenticateViewerResponseDto>;
}
