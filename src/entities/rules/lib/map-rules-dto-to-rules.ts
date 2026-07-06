import { type RuleDto, type RulesResponseDto } from "../api/types";
import { type Rule } from "../model/types";

function readRulesDto(dto: RulesResponseDto): RuleDto[] {
  if (Array.isArray(dto)) {
    return dto;
  }

  return dto.rules ?? dto.data ?? [];
}

export function mapRulesDtoToRules(dto: RulesResponseDto): Rule[] {
  return readRulesDto(dto).map((rule) => ({
    codeLength: rule.codeLength,
    createdAt: rule.createdAt,
    gameDate: rule.gameDate,
    id: String(rule.id),
    jackpotPrize: rule.jackpotPrize ? { ...rule.jackpotPrize, promoCodes: [...rule.jackpotPrize.promoCodes] } : null,
    jackpotWinsLimit: rule.jackpotWinsLimit,
    semiJackpotPrize: rule.semiJackpotPrize
      ? { ...rule.semiJackpotPrize, promoCodes: [...rule.semiJackpotPrize.promoCodes] }
      : null,
    semiJackpotWinsLimit: rule.semiJackpotWinsLimit,
    updatedAt: rule.updatedAt
  }));
}
