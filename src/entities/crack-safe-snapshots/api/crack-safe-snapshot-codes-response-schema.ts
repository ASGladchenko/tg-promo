import * as z from "zod";

export const crackSafeSnapshotCodeDtoSchema = z.object({
  activatedAt: z.string(),
  code: z.string(),
  createdAt: z.string(),
  deactivatedAt: z.string().nullable(),
  expiredSemiJackpotCodes: z.array(z.string()),
  id: z.uuid(),
  semiJackpotWinsCount: z.number(),
  semiJackpotWinsLimit: z.number(),
  sequence: z.number(),
  snapshotId: z.uuid(),
  status: z.string(),
  updatedAt: z.string(),
  winningWalletTransactionId: z.string().nullable()
});

export const crackSafeSnapshotCodesResponseDtoSchema = z.array(crackSafeSnapshotCodeDtoSchema);
