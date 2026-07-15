import { type z } from "zod";

import {
  crackSafeHistoryItemDtoSchema,
  crackSafeHistoryOutcomeDtoSchema,
  crackSafeHistoryPrizeDataDtoSchema,
  crackSafeHistoryPrizeDtoSchema,
  crackSafeHistoryResponseDtoSchema
} from "./crack-safe-history-response-schema";

export type CrackSafeHistoryOutcomeDto = z.output<typeof crackSafeHistoryOutcomeDtoSchema>;
export type CrackSafeHistoryPrizeDataDto = z.output<typeof crackSafeHistoryPrizeDataDtoSchema>;
export type CrackSafeHistoryPrizeDto = z.output<typeof crackSafeHistoryPrizeDtoSchema>;
export type CrackSafeHistoryItemDto = z.output<typeof crackSafeHistoryItemDtoSchema>;
export type CrackSafeHistoryResponseDto = z.output<typeof crackSafeHistoryResponseDtoSchema>;
