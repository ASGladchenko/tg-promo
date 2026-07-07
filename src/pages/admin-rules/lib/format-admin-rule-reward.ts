import { type RuleReward } from "@/entities/rules";

export function formatAdminRuleReward(reward: RuleReward | null) {
  if (!reward) {
    return "None";
  }

  return reward.promoCodes.join("\n");
}
