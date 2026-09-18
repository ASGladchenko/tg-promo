import * as z from "zod";

export const luckyMeadowPeriodUserDtoSchema = z.object({
  finalOutcome: z.enum(["jackpot", "semi_jackpot", "game_over", "refunded"]).nullable(),
  finishedAt: z.string().nullable(),
  imgUrl: z.string().nullable(),
  login: z.string().nullable(),
  name: z.string().nullable(),
  snapshotId: z.uuid(),
  startedAt: z.string(),
  status: z.enum(["active", "finished", "refund_pending", "refunded"]),
  surname: z.string().nullable(),
  userId: z.uuid(),
  userSnapshotId: z.uuid()
});

export const luckyMeadowPeriodUsersResponseDtoSchema = z.object({
  items: z.array(luckyMeadowPeriodUserDtoSchema),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  total: z.number().int().min(0)
});
