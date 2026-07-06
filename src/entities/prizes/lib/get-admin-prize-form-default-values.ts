import { type AdminPrizeFormState } from "../model/admin-prize-form-schema";
import { type Prize } from "../model/types";

export function getAdminPrizeFormDefaultValues(prize?: Prize): AdminPrizeFormState {
  if (!prize) {
    return {
      name: "",
      description: "",
      isActive: true,
      metadataType: "",
      metadata: []
    };
  }

  const metadataType = typeof prize.metadata.type === "string" ? prize.metadata.type : "";

  const metadata = Object.entries(prize.metadata)
    .filter(([key]) => key.toLowerCase() !== "type")
    .map(([key, value]) => ({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value)
    }));

  return {
    name: prize.name,
    description: prize.description,
    isActive: prize.isActive,
    metadataType,
    metadata
  };
}
