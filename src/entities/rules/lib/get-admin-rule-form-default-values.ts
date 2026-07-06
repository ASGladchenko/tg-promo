import { ADMIN_RULE_DEFAULT_CODE_LENGTH, type AdminRuleFormInput } from "../model/admin-rule-form-schema";
import { type RuleReward, type Rule } from "../model/types";

function mapRewardToFormValue(reward: RuleReward | null) {
  if (!reward) {
    return {
      prizeId: "",
      promoCodes: [{ value: "" }]
    };
  }

  return {
    prizeId: reward.prizeId,
    promoCodes: reward.promoCodes.map((promoCode) => ({ value: promoCode }))
  };
}

export function getAdminRuleFormDefaultValues(rule?: Rule): AdminRuleFormInput {
  if (!rule) {
    return {
      gameDate: "",
      codeLength: String(ADMIN_RULE_DEFAULT_CODE_LENGTH),
      jackpotPrize: {
        prizeId: "",
        promoCodes: [{ value: "" }]
      },
      semiJackpotPrize: {
        prizeId: "",
        promoCodes: [{ value: "" }]
      }
    };
  }

  return {
    gameDate: rule.gameDate,
    codeLength: String(rule.codeLength),
    jackpotPrize: mapRewardToFormValue(rule.jackpotPrize),
    semiJackpotPrize: mapRewardToFormValue(rule.semiJackpotPrize)
  };
}
