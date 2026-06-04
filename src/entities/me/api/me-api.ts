import { getApiUrl } from "@/shared/api";
import { type Me } from "../model/types";

type AuthMeParams = {
  initData?: string;
  signal?: AbortSignal;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readMeResponse(payload: unknown): Me {
  if (isRecord(payload) && isRecord(payload.user)) {
    return payload.user as Me;
  }

  return payload as Me;
}

export async function authMe({ initData, signal }: AuthMeParams = {}): Promise<Me> {
  const response = await fetch(getApiUrl("auth"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ initData }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return readMeResponse(payload);
}
