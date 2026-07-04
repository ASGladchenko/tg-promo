export type PrizeDto = {
  id?: number | string | null;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  amount?: number | string | null;
  status?: string | null;
};

export type PrizesResponseDto = PrizeDto[] | { prizes?: PrizeDto[]; data?: PrizeDto[] };
