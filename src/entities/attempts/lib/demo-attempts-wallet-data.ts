import { type AttemptsWalletData } from "../model/types";

export const DEMO_ATTEMPTS_WALLET_DATA: AttemptsWalletData = {
  permanentAttempts: 12,
  dailyAttempts: 3,
  dailyExpiresAt: "23:59",
  rewards: [
    {
      id: "invite-friend",
      kind: "invite-friend",
      attempts: 2,
      status: "available"
    },
    {
      id: "confirm-email",
      kind: "confirm-email",
      attempts: 1,
      status: "available"
    },
    {
      id: "add-phone",
      kind: "add-phone",
      attempts: 1,
      status: "coming-soon"
    },
    {
      id: "subscribe-channel",
      kind: "subscribe-channel",
      attempts: 2,
      status: "completed"
    }
  ]
};
