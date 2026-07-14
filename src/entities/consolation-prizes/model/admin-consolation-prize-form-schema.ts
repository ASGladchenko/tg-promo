import * as z from "zod";

export const adminConsolationPrizeRequiredMetadataLanguageKeys = ["ar", "fr", "en"] as const;

export type AdminConsolationPrizeRequiredMetadataLanguageKey =
  (typeof adminConsolationPrizeRequiredMetadataLanguageKeys)[number];

const adminConsolationPrizeRequiredMetadataValueSchema = z
  .string()
  .trim()
  .min(1, "Metadata value is required");

const adminConsolationPrizeRequiredMetadataLanguagesSchema = z.object(
  Object.fromEntries(
    adminConsolationPrizeRequiredMetadataLanguageKeys.map((key) => [
      key,
      adminConsolationPrizeRequiredMetadataValueSchema
    ])
  ) as Record<
    AdminConsolationPrizeRequiredMetadataLanguageKey,
    typeof adminConsolationPrizeRequiredMetadataValueSchema
  >
);

const adminConsolationPrizeMetadataFieldSchema = z.object({
  key: z.string().trim().min(1, "Metadata key is required"),
  value: z.string().trim().min(1, "Metadata value is required")
});

export const adminConsolationPrizeFormSchema = z
  .object({
    prizeId: z.uuid("Select a prize"),
    promoCode: z
      .string()
      .trim()
      .min(1, "Promo code is required")
      .max(100, "Promo code must contain at most 100 characters"),
    description: z.string().trim(),
    metadataLanguages: adminConsolationPrizeRequiredMetadataLanguagesSchema,
    metadata: z.array(adminConsolationPrizeMetadataFieldSchema),
    expiresAt: z
      .string()
      .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use YYYY-MM-DD format"),
    isActive: z.boolean()
  })
  .superRefine((data, context) => {
    const seenKeys = new Set<string>();
    const reservedKeys = new Set<string>(adminConsolationPrizeRequiredMetadataLanguageKeys);

    data.metadata.forEach((field, index) => {
      const key = field.key.trim();
      const normalizedKey = key.toLowerCase();

      if (reservedKeys.has(normalizedKey)) {
        context.addIssue({
          code: "custom",
          message: "Use the required metadata field instead",
          path: ["metadata", index, "key"]
        });

        return;
      }

      if (seenKeys.has(normalizedKey)) {
        context.addIssue({
          code: "custom",
          message: "Metadata key must be unique",
          path: ["metadata", index, "key"]
        });
      }

      seenKeys.add(normalizedKey);
    });
  });
