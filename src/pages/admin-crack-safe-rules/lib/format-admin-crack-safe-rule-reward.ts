import { type CrackSafeRuleReward } from "@/entities/crack-safe-rules";

export function formatAdminCrackSafeRuleReward(reward: CrackSafeRuleReward | null) {
  if (!reward) {
    return "None";
  }

  return reward.promoCodes.join("\n");
}
