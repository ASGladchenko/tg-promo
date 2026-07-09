export type LotteryAttemptOutcome = "jackpot" | "lose" | "semiJackpot";

export type LotteryAttemptNoSpendReason =
  | "gameFinished"
  | "jackpotAlreadyWon"
  | "noRules"
  | "semiJackpotAlreadyWon"
  | "userJackpotAlreadyWon";

export type LotteryAttemptWallet = {
  isChannelBonusGranted: boolean;
  notExpiredAttempts: number;
  todayAttempts: number;
  version: number;
};

export type LotteryAttemptPrize = {
  description: string | null;
  id: string;
  name: string | null;
  promoCode: string | null;
};

export type LotteryAttemptSuccessResult = {
  attemptSpent: true;
  message: string;
  outcome: LotteryAttemptOutcome;
  prize?: LotteryAttemptPrize;
  wallet: LotteryAttemptWallet;
};

export type LotteryAttemptNoSpendResult = {
  attemptSpent: false;
  message: string;
  reason: LotteryAttemptNoSpendReason;
};

export type LotteryAttemptResult = LotteryAttemptNoSpendResult | LotteryAttemptSuccessResult;

export type LotteryAvailability = {
  enteredCodes: string[];
  isAvailable: boolean;
  message: string | null;
  prize?: LotteryAttemptPrize;
};
