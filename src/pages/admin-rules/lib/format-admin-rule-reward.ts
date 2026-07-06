import { type RuleReward } from "@/entities/rules";

export function formatAdminRuleReward(reward: RuleReward | null) {
  if (!reward) {
    return "None";
  }

  return JSON.stringify(
    {
      prizeId: reward.prizeId,
      promoCodes: reward.promoCodes
    },
    null,
    2
  );
}
