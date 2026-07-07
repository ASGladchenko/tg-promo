import * as z from "zod";

export const adminPrizeRequiredMetadataLanguageKeys = ["ar", "fr", "en"] as const;

export type AdminPrizeRequiredMetadataLanguageKey = (typeof adminPrizeRequiredMetadataLanguageKeys)[number];

const adminPrizeRequiredMetadataValueSchema = z.string().trim().min(1, "Metadata value is required");

const adminPrizeRequiredMetadataLanguagesSchema = z.object(
  Object.fromEntries(
    adminPrizeRequiredMetadataLanguageKeys.map((key) => [key, adminPrizeRequiredMetadataValueSchema])
  ) as Record<AdminPrizeRequiredMetadataLanguageKey, typeof adminPrizeRequiredMetadataValueSchema>
);

const adminPrizeMetadataFieldSchema = z.object({
  key: z.string().trim().min(1, "Metadata key is required"),
  value: z.string().trim().min(1, "Metadata value is required")
});

export const adminPrizeFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Prize name is required")
      .min(2, "Prize name must contain at least 2 characters")
      .max(100, "Prize name must contain at most 100 characters"),
    description: z.string().trim(),
    isActive: z.boolean(),
    metadataType: z.string().trim().min(1, "Metadata type is required"),
    metadataLanguages: adminPrizeRequiredMetadataLanguagesSchema,
    metadata: z.array(adminPrizeMetadataFieldSchema)
  })
  .superRefine((data, context) => {
    const seenKeys = new Set<string>();
    const reservedKeys = new Set(["type", ...adminPrizeRequiredMetadataLanguageKeys]);

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
