import * as z from "zod";

export const prizeDtoSchema = z.object({
  createdAt: z.string(),
  description: z.string().nullish(),
  id: z.uuid(),
  isActive: z.boolean(),
  metadata: z.record(z.string(), z.unknown()),
  name: z.string(),
  updatedAt: z.string()
});

export const prizesResponseDtoSchema = z.array(prizeDtoSchema);

export const userPrizeDtoSchema = z.object({
  awardOrder: z.number(),
  createdAt: z.string(),
  createdBy: z.string().nullable(),
  id: z.uuid(),
  outcome: z.unknown().optional(),
  prizeData: z.record(z.string(), z.unknown()),
  prizeId: z.uuid(),
  sourceId: z.string().nullable(),
  sourceType: z.string(),
  updatedAt: z.string(),
  userId: z.uuid()
});

export const myPrizesResponseDtoSchema = z.array(userPrizeDtoSchema);
