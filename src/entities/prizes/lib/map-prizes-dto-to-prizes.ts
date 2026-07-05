import { type PrizeDto, type PrizesResponseDto } from "../api/types";
import { type Prize } from "../model/types";

function readPrizesDto(dto: PrizesResponseDto): PrizeDto[] {
  if (Array.isArray(dto)) {
    return dto;
  }

  return dto.prizes ?? dto.data ?? [];
}

function formatValue(value: number | string | null | undefined, fallback = "-") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

export function mapPrizesDtoToPrizes(dto: PrizesResponseDto): Prize[] {
  return readPrizesDto(dto).map((prize) => ({
    name: prize.name,
    id: String(prize.id),
    isActive: prize.isActive,
    updatedAt: prize.updatedAt,
    createdAt: prize.createdAt,
    metadata: { ...prize.metadata },
    description: formatValue(prize.description)
  }));
}
