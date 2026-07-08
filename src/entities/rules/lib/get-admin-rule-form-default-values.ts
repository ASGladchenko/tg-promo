import * as z from "zod";

import { ADMIN_RULE_DEFAULT_CODE_LENGTH } from "../model/admin-rule-form-schema";
import { type AdminRuleFormInput, type RuleReward, type Rule } from "../model/types";

function mapRewardToFormValue(reward: RuleReward | null) {
  if (!reward) {
    return {
      prizeId: "",
      promoCodes: ""
    };
  }

  return {
    prizeId: reward.prizeId,
    promoCodes: reward.promoCodes.join(", ")
  };
}

const adminRuleFormDefaultValuesSchema = z
  .custom<Rule | undefined>()
  .transform((rule): AdminRuleFormInput => {
    if (!rule) {
      return {
        gameDate: "",
        codeLength: String(ADMIN_RULE_DEFAULT_CODE_LENGTH),
        jackpotPrize: {
          prizeId: "",
          promoCodes: ""
        },
        semiJackpotPrize: {
          prizeId: "",
          promoCodes: ""
        }
      };
    }

    return {
      gameDate: rule.gameDate,
      codeLength: String(rule.codeLength),
      jackpotPrize: mapRewardToFormValue(rule.jackpotPrize),
      semiJackpotPrize: mapRewardToFormValue(rule.semiJackpotPrize)
    };
  });

export function getAdminRuleFormDefaultValues(rule?: Rule): AdminRuleFormInput {
  return adminRuleFormDefaultValuesSchema.parse(rule);
}
