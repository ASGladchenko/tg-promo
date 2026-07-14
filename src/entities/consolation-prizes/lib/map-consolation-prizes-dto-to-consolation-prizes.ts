import { type ConsolationPrizesResponseDto } from "../api/types";
import { type ConsolationPrize } from "../model/types";

export function mapConsolationPrizesDtoToConsolationPrizes(
  dto: ConsolationPrizesResponseDto
): ConsolationPrize[] {
  return dto.map((prize) => ({ ...prize, description: prize.description ?? "" }));
}
