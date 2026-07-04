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
  return readPrizesDto(dto).map((prize, index) => {
    const id = formatValue(prize.id, String(index + 1));

    return {
      id,
      title: formatValue(prize.title ?? prize.name, `Prize ${index + 1}`),
      description: formatValue(prize.description),
      amount: formatValue(prize.amount),
      status: formatValue(prize.status)
    };
  });
}
