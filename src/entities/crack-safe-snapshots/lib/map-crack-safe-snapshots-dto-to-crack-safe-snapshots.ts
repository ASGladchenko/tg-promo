import { type CrackSafeSnapshotsResponseDto } from "../api/types";
import { type CrackSafeSnapshot } from "../model/types";

export function mapCrackSafeSnapshotsDtoToCrackSafeSnapshots(
  dto: CrackSafeSnapshotsResponseDto
): CrackSafeSnapshot[] {
  return dto.map((snapshot) => ({
    ...snapshot,
    jackpotPrize: snapshot.jackpotPrize
      ? {
          ...snapshot.jackpotPrize,
          metadata: { ...snapshot.jackpotPrize.metadata },
          promoCodes: [...snapshot.jackpotPrize.promoCodes]
        }
      : null,
    semiJackpotPrize: snapshot.semiJackpotPrize
      ? {
          ...snapshot.semiJackpotPrize,
          metadata: { ...snapshot.semiJackpotPrize.metadata },
          promoCodes: [...snapshot.semiJackpotPrize.promoCodes]
        }
      : null
  }));
}
