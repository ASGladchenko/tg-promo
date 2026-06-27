import { getApiUrl } from "@/shared/api";

type ChannelSubscriptionWalletDto = {
  isChannelBonusGranted: boolean;
  notExpiredAttempts: number;
  todayAttempts: number;
  version: number;
};

export type ChannelSubscriptionCheckResponseDto =
  | {
      channelBonusGranted: false;
      isChannelSubscribed: false;
      wallet?: undefined;
    }
  | {
      channelBonusGranted: boolean;
      isChannelSubscribed: true;
      wallet: ChannelSubscriptionWalletDto;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isChannelSubscriptionWalletDto(value: unknown): value is ChannelSubscriptionWalletDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.isChannelBonusGranted === "boolean" &&
    typeof value.notExpiredAttempts === "number" &&
    typeof value.todayAttempts === "number" &&
    typeof value.version === "number"
  );
}

function parseChannelSubscriptionCheckResponseDto(
  value: unknown
): ChannelSubscriptionCheckResponseDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const { channelBonusGranted, isChannelSubscribed, wallet } = value;

  if (typeof channelBonusGranted !== "boolean" || typeof isChannelSubscribed !== "boolean") {
    return null;
  }

  if (!isChannelSubscribed) {
    if (channelBonusGranted) {
      return null;
    }

    return {
      channelBonusGranted,
      isChannelSubscribed
    };
  }

  if (!isChannelSubscriptionWalletDto(wallet)) {
    return null;
  }

  return {
    channelBonusGranted,
    isChannelSubscribed,
    wallet
  };
}

export async function checkChannelSubscription(
  signal?: AbortSignal
): Promise<ChannelSubscriptionCheckResponseDto> {
  const response = await fetch(getApiUrl("telegram/channel-subscription/check"), {
    method: "POST",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Channel subscription check failed with status ${response.status}`);
  }

  const payload = parseChannelSubscriptionCheckResponseDto(await response.json());

  if (!payload) {
    throw new Error("Channel subscription check returned invalid payload");
  }

  return payload;
}
