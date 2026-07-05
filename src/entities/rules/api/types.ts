export type RuleRewardDto = {
  prizeId: string;
  promoCodes: string[];
};

export type RuleDto = {
  codeLength: number;
  createdAt: string;
  gameDate: string;
  id: number | string;
  jackpotPrize: RuleRewardDto | null;
  jackpotWinsLimit: number;
  semiJackpotPrize: RuleRewardDto | null;
  semiJackpotWinsLimit: number;
  updatedAt: string;
};

export type RulesResponseDto = RuleDto[] | { rules?: RuleDto[]; data?: RuleDto[] };

export type RuleRewardPayload = {
  prizeId: string;
  promoCodes: string[];
};

export type CreateRulePayload = {
  codeLength: number;
  gameDate: string;
  jackpotPrize: RuleRewardPayload;
  semiJackpotPrize?: RuleRewardPayload;
};

export type CreateTodayRulePayload = Omit<CreateRulePayload, "gameDate">;

export type UpdateRulePayload = Partial<{
  codeLength: number;
  gameDate: string;
  jackpotPrize: RuleRewardPayload | null;
  semiJackpotPrize: RuleRewardPayload | null;
}>;

export type UpdateRuleVariables = {
  date: string;
  payload: UpdateRulePayload;
};
