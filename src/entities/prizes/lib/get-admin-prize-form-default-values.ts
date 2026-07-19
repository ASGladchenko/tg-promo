import * as z from "zod";

import { adminPrizeRequiredMetadataLanguageKeys } from "../model/admin-prize-form-schema";
import { type AdminPrizeFormState, type Prize } from "../model/types";

function getMetadataLanguages(metadata: Prize["metadata"]): AdminPrizeFormState["metadataLanguages"] {
  return Object.fromEntries(
    adminPrizeRequiredMetadataLanguageKeys.map((key) => {
      const value = metadata[key];

      return [key, typeof value === "string" ? value : ""];
    })
  ) as AdminPrizeFormState["metadataLanguages"];
}

function getMetadataFields(metadata: Prize["metadata"]) {
  const reservedKeys = new Set(["type", ...adminPrizeRequiredMetadataLanguageKeys]);

  return Object.entries(metadata)
    .filter(([key]) => !reservedKeys.has(key.toLowerCase()))
    .map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value)
    }));
}

const adminPrizeFormDefaultValuesSchema = z.custom<Prize | undefined>().transform((prize): AdminPrizeFormState => {
  if (!prize) {
    return {
      name: "",
      description: "",
      isActive: true,
      metadataLanguages: {
        ar: "",
        fr: "",
        en: ""
      },
      metadata: []
    };
  }

  return {
    name: prize.name,
    description: prize.description,
    isActive: prize.isActive,
    metadataLanguages: getMetadataLanguages(prize.metadata),
    metadata: getMetadataFields(prize.metadata)
  };
});

export function getAdminPrizeFormDefaultValues(prize?: Prize): AdminPrizeFormState {
  return adminPrizeFormDefaultValuesSchema.parse(prize);
}
