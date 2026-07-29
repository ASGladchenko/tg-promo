import { type CrackSafeRulesResponseDto } from "../api/types";
import { type CrackSafeRule } from "../model/types";

export function mapCrackSafeRulesDtoToCrackSafeRules(dto: CrackSafeRulesResponseDto): CrackSafeRule[] {
  return dto.map((rule) => ({
    codeLength: rule.codeLength,
    createdAt: rule.createdAt,
    endDate: rule.endDate,
    id: rule.id,
    jackpotPrize: { ...rule.jackpotPrize, promoCodes: [...rule.jackpotPrize.promoCodes] },
    jackpotWinsLimit: rule.jackpotWinsLimit,
    scheduleId: rule.scheduleId,
    semiJackpotPrize: rule.semiJackpotPrize
      ? { ...rule.semiJackpotPrize, promoCodes: [...rule.semiJackpotPrize.promoCodes] }
      : null,
    semiJackpotWinsLimit: rule.semiJackpotWinsLimit,
    startDate: rule.startDate,
    updatedAt: rule.updatedAt
  }));
}
