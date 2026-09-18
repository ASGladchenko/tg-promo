import { type AttemptReward } from "@/entities/attempts";
import { type WalletAttemptRewardsSettings } from "@/entities/settings";

export function getAttemptRewards(settings: WalletAttemptRewardsSettings): AttemptReward[] {
  return [
    {
      id: "invite-friend",
      kind: "invite-friend",
      attempts: settings.referralFirstPlayAttempts,
      status: "available"
    },
    {
      id: "add-phone",
      kind: "add-phone",
      attempts: settings.phoneConfirmationAttempts,
      status: "available"
    },
    {
      id: "subscribe-channel",
      kind: "subscribe-channel",
      attempts: settings.channelSubscriptionAttempts,
      status: "available"
    }
  ];
}
