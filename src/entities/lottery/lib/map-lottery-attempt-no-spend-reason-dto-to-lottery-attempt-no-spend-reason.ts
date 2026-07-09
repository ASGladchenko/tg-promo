import { type LotteryAttemptNoSpendReasonDto } from "../api/types";
import { type LotteryAttemptNoSpendReason } from "../model/types";

const noSpendReasonMap: Record<LotteryAttemptNoSpendReasonDto, LotteryAttemptNoSpendReason> = {
  game_finished: "gameFinished",
  jackpot_already_won: "jackpotAlreadyWon",
  no_rules: "noRules",
  semi_jackpot_already_won: "semiJackpotAlreadyWon",
  user_jackpot_already_won: "userJackpotAlreadyWon"
};

export function mapLotteryAttemptNoSpendReasonDtoToLotteryAttemptNoSpendReason(
  dto: LotteryAttemptNoSpendReasonDto
): LotteryAttemptNoSpendReason {
  return noSpendReasonMap[dto];
}
