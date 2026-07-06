import * as z from "zod";

import { type AdminPrizeFormState, type Prize } from "../model/types";

function getMetadataType(metadata: Prize["metadata"]) {
  return typeof metadata.type === "string" ? metadata.type : "";
}

function getMetadataFields(metadata: Prize["metadata"]) {
  return Object.entries(metadata)
    .filter(([key]) => key.toLowerCase() !== "type")
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
      metadataType: "",
      metadata: []
    };
  }

  return {
    name: prize.name,
    description: prize.description,
    isActive: prize.isActive,
    metadataType: getMetadataType(prize.metadata),
    metadata: getMetadataFields(prize.metadata)
  };
});

export function getAdminPrizeFormDefaultValues(prize?: Prize): AdminPrizeFormState {
  return adminPrizeFormDefaultValuesSchema.parse(prize);
}
