import { type CreateRulePayload, type RuleRewardPayload, type UpdateRulePayload } from "../api/types";
import { type AdminRuleFormState } from "../model/admin-rule-form-schema";
import { type RuleReward, type Rule } from "../model/types";

function mapRewardFormToPayload(reward: AdminRuleFormState["jackpotPrize"]): RuleRewardPayload {
  return {
    prizeId: reward.prizeId.trim(),
    promoCodes: reward.promoCodes.map((promoCode) => promoCode.value.trim()).filter(Boolean)
  };
}

function areRewardPayloadsEqual(left: RuleRewardPayload | null, right: RuleReward | null) {
  if (!left || !right) {
    return left === right;
  }

  return (
    left.prizeId === right.prizeId &&
    left.promoCodes.length === right.promoCodes.length &&
    left.promoCodes.every((promoCode, index) => promoCode === right.promoCodes[index])
  );
}

export function mapAdminRuleFormToCreatePayload(data: AdminRuleFormState): CreateRulePayload {
  const payload: CreateRulePayload = {
    gameDate: data.gameDate.trim(),
    codeLength: Number(data.codeLength),
    jackpotPrize: mapRewardFormToPayload(data.jackpotPrize)
  };

  if (data.semiJackpotPrize) {
    payload.semiJackpotPrize = mapRewardFormToPayload(data.semiJackpotPrize);
  }

  return payload;
}

export function mapAdminRuleFormToUpdatePayload(data: AdminRuleFormState, rule: Rule): UpdateRulePayload {
  const payload: UpdateRulePayload = {};
  const jackpotPrize = mapRewardFormToPayload(data.jackpotPrize);
  const semiJackpotPrize = data.semiJackpotPrize ? mapRewardFormToPayload(data.semiJackpotPrize) : null;
  const gameDate = data.gameDate.trim();
  const codeLength = Number(data.codeLength);

  if (gameDate !== rule.gameDate) {
    payload.gameDate = gameDate;
  }

  if (codeLength !== rule.codeLength) {
    payload.codeLength = codeLength;
  }

  if (!areRewardPayloadsEqual(jackpotPrize, rule.jackpotPrize)) {
    payload.jackpotPrize = jackpotPrize;
  }

  if (!areRewardPayloadsEqual(semiJackpotPrize, rule.semiJackpotPrize)) {
    payload.semiJackpotPrize = semiJackpotPrize;
  }

  return payload;
}
