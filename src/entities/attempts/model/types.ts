export type AttemptRewardStatus = "available" | "completed" | "coming-soon";
export type AttemptRewardKind = "invite-friend" | "confirm-email" | "add-phone" | "subscribe-channel";
export type AttemptReward = {
  attempts: number;
  id: string;
  kind: AttemptRewardKind;
  status: AttemptRewardStatus;
};
export type AttemptsWallet = {
  dailyAttempts: number;
  isChannelBonusGranted: boolean;
  permanentAttempts: number;
  totalAttempts: number;
};
export type AttemptsWalletData = {
  dailyAttempts: number;
  permanentAttempts: number;
  totalAttempts: number;
};
