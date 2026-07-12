import { type z } from "zod";

import { type createConsolationPrizePayloadSchema } from "../model/consolation-prize-payload-schemas";
import { type updateConsolationPrizePayloadSchema } from "../model/consolation-prize-payload-schemas";
import {
  consolationPrizeDtoSchema,
  consolationPrizesResponseDtoSchema
} from "./consolation-prizes-response-schema";

export type ConsolationPrizeDto = z.output<typeof consolationPrizeDtoSchema>;
export type ConsolationPrizesResponseDto = z.output<typeof consolationPrizesResponseDtoSchema>;
export type CreateConsolationPrizePayload = z.output<typeof createConsolationPrizePayloadSchema>;
export type UpdateConsolationPrizePayload = z.output<typeof updateConsolationPrizePayloadSchema>;
export type UpdateConsolationPrizeVariables = {
  id: ConsolationPrizeDto["id"];
  payload: UpdateConsolationPrizePayload;
};
