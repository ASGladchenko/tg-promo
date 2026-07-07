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
