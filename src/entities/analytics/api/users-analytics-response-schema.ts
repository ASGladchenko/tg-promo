import * as z from "zod";

const usersAnalyticsDateDtoSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const usersAnalyticsResponseDtoSchema = z.object({
  activeUsers: z.object({
    dau: z.number(),
    mau: z.number(),
    wau: z.number()
  }),
  range: z.object({
    from: usersAnalyticsDateDtoSchema,
    timezone: z.literal("UTC"),
    to: usersAnalyticsDateDtoSchema
  }),
  users: z.object({
    new: z.number(),
    newFromReferral: z.number(),
    total: z.number()
  })
});
