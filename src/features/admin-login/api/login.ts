import { type MeDto } from "@/entities/me";
import { getApiUrl } from "@/shared/api";

import { type LoginFormState } from "../model/admin-login-schema";

export async function loginAdmin(payload: LoginFormState, signal?: AbortSignal): Promise<MeDto> {
  const response = await fetch(getApiUrl("auth"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    throw new Error(`Admin login request failed with status ${response.status}`);
  }

  return response.json() as Promise<MeDto>;
}
