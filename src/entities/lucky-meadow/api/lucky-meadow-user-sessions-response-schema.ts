import * as z from "zod";

const luckyMeadowSessionStatusDtoSchema = z.enum(["active", "finished", "refund_pending", "refunded"]);

const luckyMeadowFinalOutcomeDtoSchema = z
  .enum(["jackpot", "semi_jackpot", "game_over", "refunded"])
  .nullable();

export const luckyMeadowUserSessionDtoSchema = z.object({
  finalOutcome: luckyMeadowFinalOutcomeDtoSchema,
  finishedAt: z.string().nullable(),
  jackpotCount: z.number().int().min(0),
  semiJackpotConsumed: z.boolean(),
  semiJackpotCount: z.number().int().min(0),
  snapshotId: z.uuid(),
  startedAt: z.string(),
  status: luckyMeadowSessionStatusDtoSchema,
  userSnapshotId: z.uuid()
});

export const luckyMeadowUserSessionsResponseDtoSchema = z.object({
  items: z.array(luckyMeadowUserSessionDtoSchema),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  total: z.number().int().min(0)
});

export const luckyMeadowUserSessionDetailsDtoSchema = z.object({
  cells: z
    .array(
      z.object({
        openedAt: z.string().nullable(),
        outcome: z.enum(["trap", "empty", "jackpot", "semi_jackpot"]),
        position: z.number().int().min(0).max(23)
      })
    )
    .length(24),
  endDate: z.string(),
  finalOutcome: luckyMeadowFinalOutcomeDtoSchema,
  snapshotId: z.uuid(),
  startDate: z.string(),
  status: luckyMeadowSessionStatusDtoSchema,
  userId: z.uuid(),
  userSnapshotId: z.uuid()
});
