import { type AttemptReward } from "../model/types";

type MOCK_REWARD_TYPE = {
  rewards: AttemptReward[];
};

export const MOCK_REWARDS: MOCK_REWARD_TYPE = {
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
      status: "available"
    },
    {
      id: "subscribe-channel",
      kind: "subscribe-channel",
      attempts: 1,
      status: "available"
    }
  ]
};
