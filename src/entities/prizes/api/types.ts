import { type z } from "zod";

import {
  myPrizesResponseDtoSchema,
  prizeDtoSchema,
  prizesResponseDtoSchema,
  userPrizeDtoSchema
} from "./prizes-response-schema";

export type PrizeDto = z.output<typeof prizeDtoSchema>;
export type PrizesResponseDto = z.output<typeof prizesResponseDtoSchema>;
export type UserPrizeDto = z.output<typeof userPrizeDtoSchema>;
export type MyPrizesResponseDto = z.output<typeof myPrizesResponseDtoSchema>;

export type CreatePrizePayload = {
  name: string;
  description?: string;
  isActive?: boolean;
  metadata: Record<string, unknown>;
};

export type UpdatePrizePayload = CreatePrizePayload;
export type PrizeId = PrizeDto["id"];
export type UpdatePrizeVariables = {
  id: PrizeId;
  payload: UpdatePrizePayload;
};
