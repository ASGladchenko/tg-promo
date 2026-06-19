import { type AttemptsWalletDto } from "@/entities/attempts";
import { type MeDto } from "@/entities/me";
import { getApiUrl } from "@/shared/api";

export type ViewerDataDto = MeDto & {
  wallet: AttemptsWalletDto;
};

export async function getViewerData(signal?: AbortSignal): Promise<ViewerDataDto> {
  const response = await fetch(getApiUrl("auth/me"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Viewer data request failed with status ${response.status}`);
  }

  return response.json() as Promise<ViewerDataDto>;
}
