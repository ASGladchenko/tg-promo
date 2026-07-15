import * as z from "zod";

export const crackSafeSnapshotPrizeDtoSchema = z.object({
  name: z.string(),
  prizeId: z.uuid(),
  metadata: z.record(z.string(), z.string()),
  promoCodes: z.array(z.string()),
  description: z.string()
});

export const crackSafeSnapshotDtoSchema = z.object({
  codeLength: z.number(),
  createdAt: z.string(),
  endsAt: z.string(),
  gameDate: z.string(),
  id: z.uuid(),
  jackpotPrize: crackSafeSnapshotPrizeDtoSchema.nullable(),
  jackpotWinsCount: z.number(),
  jackpotWinsLimit: z.number(),
  rulesId: z.uuid(),
  semiJackpotPrize: crackSafeSnapshotPrizeDtoSchema.nullable(),
  semiJackpotWinsCount: z.number().default(0),
  semiJackpotWinsLimit: z.number(),
  startsAt: z.string(),
  status: z.string(),
  updatedAt: z.string()
});

export const crackSafeSnapshotsResponseDtoSchema = z.array(crackSafeSnapshotDtoSchema);
