import {
  type CreateCrackSafeRulePayload,
  type CrackSafeRuleRewardPayload,
  type UpdateCrackSafeRulePayload
} from "../api/types";
import {
  type AdminCrackSafeRuleFormState,
  type CrackSafeRuleReward,
  type CrackSafeRule
} from "../model/types";

function parsePromoCodes(value: string) {
  return value
    .split(",")
    .map((promoCode) => promoCode.trim())
    .filter(Boolean);
}

function mapRewardFormToPayload(
  reward: AdminCrackSafeRuleFormState["jackpotPrize"]
): CrackSafeRuleRewardPayload {
  return {
    prizeId: reward.prizeId.trim(),
    promoCodes: parsePromoCodes(reward.promoCodes)
  };
}

function areRewardPayloadsEqual(left: CrackSafeRuleRewardPayload | null, right: CrackSafeRuleReward | null) {
  if (!left || !right) {
    return left === right;
  }

  return (
    left.prizeId === right.prizeId &&
    left.promoCodes.length === right.promoCodes.length &&
    left.promoCodes.every((promoCode, index) => promoCode === right.promoCodes[index])
  );
}

export function mapAdminCrackSafeRuleFormToCreatePayload(
  data: AdminCrackSafeRuleFormState
): CreateCrackSafeRulePayload {
  const payload: CreateCrackSafeRulePayload = {
    gameDate: data.gameDate.trim(),
    codeLength: Number(data.codeLength),
    jackpotPrize: mapRewardFormToPayload(data.jackpotPrize)
  };

  if (data.semiJackpotPrize) {
    payload.semiJackpotPrize = mapRewardFormToPayload(data.semiJackpotPrize);
  }

  return payload;
}

export function mapAdminCrackSafeRuleFormToUpdatePayload(
  data: AdminCrackSafeRuleFormState,
  rule: CrackSafeRule
): UpdateCrackSafeRulePayload {
  const payload: UpdateCrackSafeRulePayload = {};
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
