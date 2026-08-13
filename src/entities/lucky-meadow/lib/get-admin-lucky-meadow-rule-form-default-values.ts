import { type AdminLuckyMeadowRuleFormInput } from "../model/form-types";
import { type LuckyMeadowRule } from "../model/types";

export function getAdminLuckyMeadowRuleFormDefaultValues(
  rule?: LuckyMeadowRule
): AdminLuckyMeadowRuleFormInput {
  if (!rule) {
    return {
      endDate: "",
      jackpotPrize: { prizeId: "", promoCodes: "" },
      semiJackpotPrize: { prizeId: "", promoCodes: "" },
      startDate: ""
    };
  }

  return {
    endDate: rule.endDate,
    jackpotPrize: {
      prizeId: rule.jackpotPrize.prizeId,
      promoCodes: rule.jackpotPrize.promoCodes.join(", ")
    },
    semiJackpotPrize: {
      prizeId: rule.semiJackpotPrize?.prizeId ?? "",
      promoCodes: rule.semiJackpotPrize?.promoCodes.join(", ") ?? ""
    },
    startDate: rule.startDate
  };
}
