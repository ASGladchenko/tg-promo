import { type CrackSafeRulesResponseDto } from "../api/types";
import { type CrackSafeRule } from "../model/types";

export function mapCrackSafeRulesDtoToCrackSafeRules(dto: CrackSafeRulesResponseDto): CrackSafeRule[] {
  return dto.map((rule) => ({
    codeLength: rule.codeLength,
    createdAt: rule.createdAt,
    gameDate: rule.gameDate,
    id: rule.id,
    jackpotPrize: rule.jackpotPrize
      ? { ...rule.jackpotPrize, promoCodes: [...rule.jackpotPrize.promoCodes] }
      : null,
    jackpotWinsLimit: rule.jackpotWinsLimit,
    semiJackpotPrize: rule.semiJackpotPrize
      ? { ...rule.semiJackpotPrize, promoCodes: [...rule.semiJackpotPrize.promoCodes] }
      : null,
    semiJackpotWinsLimit: rule.semiJackpotWinsLimit,
    updatedAt: rule.updatedAt
  }));
}
