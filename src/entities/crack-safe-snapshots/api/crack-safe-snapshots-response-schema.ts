import * as z from "zod";

export const crackSafeSnapshotPrizeDtoSchema = z.object({
  description: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  name: z.string(),
  prizeId: z.uuid(),
  promoCodes: z.array(z.string())
});

export const crackSafeSnapshotDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  endDate: z.string(),
  endsAt: z.string(),
  id: z.uuid(),
  jackpotPrize: crackSafeSnapshotPrizeDtoSchema,
  jackpotWinsCount: z.number(),
  jackpotWinsLimit: z.number(),
  rulesId: z.uuid(),
  scheduleId: z.uuid(),
  semiJackpotPrize: crackSafeSnapshotPrizeDtoSchema.nullable(),
  semiJackpotWinsLimit: z.number(),
  startDate: z.string(),
  startsAt: z.string(),
  status: z.enum(["active", "finished"]),
  updatedAt: z.string()
});

export const crackSafeSnapshotsResponseDtoSchema = z.array(crackSafeSnapshotDtoSchema);
