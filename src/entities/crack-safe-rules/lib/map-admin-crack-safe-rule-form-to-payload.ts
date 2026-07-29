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
    codeLength: Number(data.codeLength),
    endDate: data.endDate.trim(),
    jackpotPrize: mapRewardFormToPayload(data.jackpotPrize),
    startDate: data.startDate.trim()
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
  const codeLength = Number(data.codeLength);
  const endDate = data.endDate.trim();
  const startDate = data.startDate.trim();

  if (codeLength !== rule.codeLength) {
    payload.codeLength = codeLength;
  }

  if (endDate !== rule.endDate) {
    payload.endDate = endDate;
  }

  if (!areRewardPayloadsEqual(jackpotPrize, rule.jackpotPrize)) {
    payload.jackpotPrize = jackpotPrize;
  }

  if (!areRewardPayloadsEqual(semiJackpotPrize, rule.semiJackpotPrize)) {
    payload.semiJackpotPrize = semiJackpotPrize;
  }

  if (startDate !== rule.startDate) {
    payload.startDate = startDate;
  }

  return payload;
}
