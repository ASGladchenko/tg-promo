import { type CreateLuckyMeadowRulePayload } from "../api/types";
import { type AdminLuckyMeadowRuleFormState } from "../model/form-types";

function mapPrizeToPayload(prize: AdminLuckyMeadowRuleFormState["jackpotPrize"]) {
  return {
    prizeId: prize.prizeId.trim(),
    promoCodes: prize.promoCodes
      .split(",")
      .map((promoCode) => promoCode.trim())
      .filter(Boolean)
  };
}

export function mapAdminLuckyMeadowRuleFormToPayload(
  data: AdminLuckyMeadowRuleFormState
): CreateLuckyMeadowRulePayload {
  const payload: CreateLuckyMeadowRulePayload = {
    endDate: data.endDate.trim(),
    jackpotPrize: mapPrizeToPayload(data.jackpotPrize),
    semiFallbackAttempts: Number(data.semiFallbackAttempts),
    startDate: data.startDate.trim(),
    trapCount: Number(data.trapCount)
  };

  if (data.semiJackpotPrize) {
    payload.semiJackpotPrize = mapPrizeToPayload(data.semiJackpotPrize);
  }

  return payload;
}
