import { type AttemptsWalletDto } from "../api/types";
import { type AttemptsWallet } from "../model/types";

export function mapAttemptsWalletDtoToAttemptsWallet(dto: AttemptsWalletDto): AttemptsWallet {
  return {
    dailyAttempts: dto.todayAttempts,
    isChannelBonusGranted: dto.isChannelBonusGranted,
    permanentAttempts: dto.notExpiredAttempts,
    totalAttempts: dto.notExpiredAttempts + dto.todayAttempts
  };
}
