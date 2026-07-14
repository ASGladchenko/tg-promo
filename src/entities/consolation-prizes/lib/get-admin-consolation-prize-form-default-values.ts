import { type AdminConsolationPrizeFormState, type ConsolationPrize } from "../model/types";
import { adminConsolationPrizeRequiredMetadataLanguageKeys } from "../model/admin-consolation-prize-form-schema";

function getMetadataLanguages(
  metadata: ConsolationPrize["metadata"]
): AdminConsolationPrizeFormState["metadataLanguages"] {
  return Object.fromEntries(
    adminConsolationPrizeRequiredMetadataLanguageKeys.map((key) => {
      const value = metadata[key];

      return [key, typeof value === "string" ? value : ""];
    })
  ) as AdminConsolationPrizeFormState["metadataLanguages"];
}

function getMetadataFields(metadata: ConsolationPrize["metadata"]) {
  const reservedKeys = new Set<string>(adminConsolationPrizeRequiredMetadataLanguageKeys);

  return Object.entries(metadata)
    .filter(([key]) => !reservedKeys.has(key.toLowerCase()))
    .map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value)
    }));
}

export function getAdminConsolationPrizeFormDefaultValues(
  prize?: ConsolationPrize
): AdminConsolationPrizeFormState {
  return prize
    ? {
        prizeId: prize.prizeId,
        promoCode: prize.promoCode,
        description: prize.description,
        metadataLanguages: getMetadataLanguages(prize.metadata),
        metadata: getMetadataFields(prize.metadata),
        expiresAt: prize.expiresAt?.slice(0, 10) ?? "",
        isActive: prize.isActive
      }
    : {
        prizeId: "",
        promoCode: "",
        description: "",
        metadataLanguages: {
          ar: "",
          fr: "",
          en: ""
        },
        metadata: [],
        expiresAt: "",
        isActive: true
      };
}
