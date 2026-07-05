export type PrizeDto = {
  createdAt: string;
  description?: string | null;
  id: number | string;
  isActive: boolean;
  metadata: Record<string, unknown>;
  name: string;
  updatedAt: string;
};

export type PrizesResponseDto = PrizeDto[] | { prizes?: PrizeDto[]; data?: PrizeDto[] };

export type CreatePrizePayload = {
  name: string;
  description?: string;
  isActive?: boolean;
  metadata: Record<string, unknown>;
};

export type UpdatePrizePayload = CreatePrizePayload;

export type UpdatePrizeVariables = {
  id: string;
  payload: UpdatePrizePayload;
};
