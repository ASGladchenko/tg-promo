import * as z from "zod";

import { ADMIN_CRACK_SAFE_RULE_DEFAULT_CODE_LENGTH } from "../model/admin-crack-safe-rule-form-schema";
import {
  type AdminCrackSafeRuleFormInput,
  type CrackSafeRuleReward,
  type CrackSafeRule
} from "../model/types";

function mapRewardToFormValue(reward: CrackSafeRuleReward | null) {
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
  .custom<CrackSafeRule | undefined>()
  .transform((rule): AdminCrackSafeRuleFormInput => {
    if (!rule) {
      return {
        gameDate: "",
        codeLength: String(ADMIN_CRACK_SAFE_RULE_DEFAULT_CODE_LENGTH),
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

export function getAdminCrackSafeRuleFormDefaultValues(rule?: CrackSafeRule): AdminCrackSafeRuleFormInput {
  return adminRuleFormDefaultValuesSchema.parse(rule);
}
