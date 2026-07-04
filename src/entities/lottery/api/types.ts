export type LotteryAttemptOutcomeDto = "jackpot" | "lose" | "semi_jackpot";

export type LotteryAttemptNoSpendReasonDto =
  | "game_finished"
  | "jackpot_already_won"
  | "no_rules"
  | "semi_jackpot_already_won";

export type LotteryAttemptWalletDto = {
  isChannelBonusGranted: boolean;
  notExpiredAttempts: number;
  todayAttempts: number;
  version: number;
};

export type LotteryAttemptPrizeDataDto = {
  description: string | null;
  metadata: Record<string, unknown>;
  name: string;
  promoCode: string;
};

export type LotteryAttemptPrizeDto = {
  id: string;
  prizeData: LotteryAttemptPrizeDataDto;
};

export type LotteryAttemptSuccessResponseDto = {
  attemptSpent: true;
  message: string;
  outcome: LotteryAttemptOutcomeDto;
  prize?: LotteryAttemptPrizeDto;
  wallet: LotteryAttemptWalletDto;
};

export type LotteryAttemptNoSpendResponseDto = {
  attemptSpent: false;
  message: string;
  reason: LotteryAttemptNoSpendReasonDto;
};

export type LotteryAttemptResponseDto =
  | LotteryAttemptNoSpendResponseDto
  | LotteryAttemptSuccessResponseDto;
