import { type AttemptReward } from "./types";

export const ATTEMPT_REWARDS_CONFIG: AttemptReward[] = [
  {
    id: "invite-friend",
    kind: "invite-friend",
    attempts: 1,
    status: "available"
  },
  {
    id: "add-phone",
    kind: "add-phone",
    attempts: 1,
    status: "available"
  },
  {
    id: "subscribe-channel",
    kind: "subscribe-channel",
    attempts: 1,
    status: "available"
  }
];
