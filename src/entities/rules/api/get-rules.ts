import { getApiUrl } from "@/shared/api";

import { type RuleDto, type RulesResponseDto } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseRuleRewardDto(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }

  const { prizeId, promoCodes } = value;

  if (typeof prizeId !== "string" || !Array.isArray(promoCodes)) {
    return null;
  }

  const parsedPromoCodes = promoCodes.filter((promoCode): promoCode is string => typeof promoCode === "string");

  return {
    prizeId,
    promoCodes: parsedPromoCodes
  };
}

function parseRuleDto(value: unknown): RuleDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const {
    codeLength,
    createdAt,
    gameDate,
    id,
    jackpotPrize,
    jackpotWinsLimit,
    semiJackpotPrize,
    semiJackpotWinsLimit,
    updatedAt
  } = value;

  if (
    typeof codeLength !== "number" ||
    typeof createdAt !== "string" ||
    typeof gameDate !== "string" ||
    (typeof id !== "string" && typeof id !== "number") ||
    typeof jackpotWinsLimit !== "number" ||
    typeof semiJackpotWinsLimit !== "number" ||
    typeof updatedAt !== "string"
  ) {
    return null;
  }

  const parsedJackpotPrize = jackpotPrize === null ? null : parseRuleRewardDto(jackpotPrize);
  const parsedSemiJackpotPrize = semiJackpotPrize === null ? null : parseRuleRewardDto(semiJackpotPrize);

  if ((jackpotPrize !== null && !parsedJackpotPrize) || (semiJackpotPrize !== null && !parsedSemiJackpotPrize)) {
    return null;
  }

  return {
    codeLength,
    createdAt,
    gameDate,
    id,
    jackpotPrize: parsedJackpotPrize,
    jackpotWinsLimit,
    semiJackpotPrize: parsedSemiJackpotPrize,
    semiJackpotWinsLimit,
    updatedAt
  };
}

function parseRuleDtoList(value: unknown): RuleDto[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.map(parseRuleDto).filter((rule): rule is RuleDto => rule !== null);
}

function parseRulesResponseDto(value: unknown): RulesResponseDto {
  const directList = parseRuleDtoList(value);

  if (directList) {
    return directList;
  }

  if (!isRecord(value)) {
    throw new Error("Rules response has invalid format");
  }

  const rules = parseRuleDtoList(value.rules);
  const data = parseRuleDtoList(value.data);

  if (rules) {
    return { rules };
  }

  if (data) {
    return { data };
  }

  throw new Error("Rules response has invalid format");
}

export async function getRulesDto(signal?: AbortSignal): Promise<RulesResponseDto> {
  const response = await fetch(getApiUrl("crack-safe/rules/"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Rules request failed with status ${response.status}`);
  }

  return parseRulesResponseDto(await response.json());
}
