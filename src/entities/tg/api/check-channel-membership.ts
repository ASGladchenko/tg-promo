import { getApiUrl } from "@/shared/api";

type MembershipResponse = {
  isMember?: unknown;
};

export async function checkChannelMembership(signal?: AbortSignal): Promise<boolean> {
  if (import.meta.env.DEV) {
    return true;
  }

  const response = await fetch(getApiUrl("/tg/checkMembership"), {
    method: "POST",
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    throw new Error(`Membership check failed with status ${response.status}`);
  }

  const payload = (await response.json()) as MembershipResponse;
  return payload.isMember === true;
}
