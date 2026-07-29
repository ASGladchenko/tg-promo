import * as z from "zod";

export const crackSafeHistoryOutcomeDtoSchema = z.enum(["jackpot", "lose", "semi_jackpot"]);

export const crackSafeHistoryPrizeDataDtoSchema = z
  .object({
    promoCode: z.string().optional()
  })
  .passthrough();

export const crackSafeHistoryPrizeDtoSchema = z
  .object({
    id: z.uuid(),
    prizeData: crackSafeHistoryPrizeDataDtoSchema
  })
  .passthrough();

export const crackSafeHistoryItemDtoSchema = z
  .object({
    attemptOrder: z.number(),
    createdAt: z.string(),
    endDate: z.string(),
    endsAt: z.string(),
    enteredCode: z.string(),
    id: z.uuid(),
    outcome: crackSafeHistoryOutcomeDtoSchema,
    prize: crackSafeHistoryPrizeDtoSchema.optional(),
    scheduleId: z.uuid(),
    startDate: z.string(),
    startsAt: z.string(),
    userId: z.uuid()
  })
  .passthrough();

export const crackSafeHistoryResponseDtoSchema = z.array(crackSafeHistoryItemDtoSchema);
