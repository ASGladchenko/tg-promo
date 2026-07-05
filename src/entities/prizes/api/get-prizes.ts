import { getApiUrl } from "@/shared/api";

import { type PrizeDto, type PrizesResponseDto } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parsePrizeDto(value: unknown): PrizeDto | null {
  if (!isRecord(value)) {
    return null;
  }

  const { createdAt, description, id, isActive, metadata, name, updatedAt } = value;

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    typeof name !== "string" ||
    typeof isActive !== "boolean" ||
    !isRecord(metadata) ||
    typeof createdAt !== "string" ||
    typeof updatedAt !== "string"
  ) {
    return null;
  }

  if (description !== null && description !== undefined && typeof description !== "string") {
    return null;
  }

  return {
    createdAt,
    description,
    id,
    isActive,
    metadata,
    name,
    updatedAt
  };
}

function parsePrizeDtoList(value: unknown): PrizeDto[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  return value.map(parsePrizeDto).filter((prize): prize is PrizeDto => prize !== null);
}

function parsePrizesResponseDto(value: unknown): PrizesResponseDto {
  const directList = parsePrizeDtoList(value);

  if (directList) {
    return directList;
  }

  if (!isRecord(value)) {
    throw new Error("Prizes response has invalid format");
  }

  const prizes = parsePrizeDtoList(value.prizes);
  const data = parsePrizeDtoList(value.data);

  if (prizes) {
    return { prizes };
  }

  if (data) {
    return { data };
  }

  throw new Error("Prizes response has invalid format");
}

export async function getPrizesDto(signal?: AbortSignal): Promise<PrizesResponseDto> {
  const response = await fetch(getApiUrl("prizes"), {
    method: "GET",
    credentials: "include",
    signal
  });

  if (!response.ok) {
    throw new Error(`Prizes request failed with status ${response.status}`);
  }

  return parsePrizesResponseDto(await response.json());
}
