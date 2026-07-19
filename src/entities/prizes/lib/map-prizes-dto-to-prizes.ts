import { type PrizesResponseDto } from "../api/types";
import { type Prize } from "../model/types";

export function mapPrizesDtoToPrizes(dto: PrizesResponseDto): Prize[] {
  return dto.map((prize) => ({
    name: prize.name,
    id: prize.id,
    isActive: prize.isActive,
    updatedAt: prize.updatedAt,
    createdAt: prize.createdAt,
    metadata: { ...prize.metadata },
    description: prize.description?.trim() || "-"
  }));
}
