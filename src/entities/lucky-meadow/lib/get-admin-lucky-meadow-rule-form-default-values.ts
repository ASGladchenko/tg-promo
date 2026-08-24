import { type AdminLuckyMeadowRuleFormInput } from "../model/form-types";
import {
  ADMIN_LUCKY_MEADOW_RULE_DEFAULT_SEMI_FALLBACK_ATTEMPTS,
  ADMIN_LUCKY_MEADOW_RULE_DEFAULT_TRAP_COUNT
} from "../model/admin-lucky-meadow-rule-form-schema";
import { type LuckyMeadowRule } from "../model/types";

export function getAdminLuckyMeadowRuleFormDefaultValues(
  rule?: LuckyMeadowRule
): AdminLuckyMeadowRuleFormInput {
  if (!rule) {
    return {
      endDate: "",
      jackpotPrize: { prizeId: "", promoCodes: "" },
      semiFallbackAttempts: String(ADMIN_LUCKY_MEADOW_RULE_DEFAULT_SEMI_FALLBACK_ATTEMPTS),
      semiJackpotPrize: { prizeId: "", promoCodes: "" },
      startDate: "",
      trapCount: String(ADMIN_LUCKY_MEADOW_RULE_DEFAULT_TRAP_COUNT)
    };
  }

  return {
    endDate: rule.endDate,
    jackpotPrize: {
      prizeId: rule.jackpotPrize.prizeId,
      promoCodes: rule.jackpotPrize.promoCodes.join(", ")
    },
    semiFallbackAttempts: String(rule.semiFallbackAttempts),
    semiJackpotPrize: {
      prizeId: rule.semiJackpotPrize?.prizeId ?? "",
      promoCodes: rule.semiJackpotPrize?.promoCodes.join(", ") ?? ""
    },
    startDate: rule.startDate,
    trapCount: String(rule.trapCount)
  };
}
