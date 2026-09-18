import * as z from "zod";

export const luckyMeadowSnapshotStatsResponseDtoSchema = z.object({
  activeUsersCount: z.number().int().min(0),
  endDate: z.string(),
  jackpotWinsCount: z.number().int().min(0),
  jackpotWinsTotal: z.number().int().min(0),
  semiJackpotWinsCount: z.number().int().min(0),
  semiJackpotWinsTotal: z.number().int().min(0),
  startDate: z.string(),
  status: z.enum(["active", "finished"])
});
