export type RuleReward = {
  prizeId: string;
  promoCodes: string[];
};

export type Rule = {
  codeLength: number;
  createdAt: string;
  gameDate: string;
  id: string;
  jackpotPrize: RuleReward | null;
  jackpotWinsLimit: number;
  semiJackpotPrize: RuleReward | null;
  semiJackpotWinsLimit: number;
  updatedAt: string;
};
