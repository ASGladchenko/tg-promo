import { type z } from "zod";

import { type ConsolationPrizeDto } from "../api/types";
import { adminConsolationPrizeFormSchema } from "./admin-consolation-prize-form-schema";

export type AdminConsolationPrizeFormState = z.output<typeof adminConsolationPrizeFormSchema>;
export type AdminConsolationPrizeDirtyFields = Partial<
  Record<keyof AdminConsolationPrizeFormState, boolean>
>;
export type ConsolationPrize = Omit<ConsolationPrizeDto, "description"> & { description: string };
export type ConsolationPrizeOption = { id: string; name: string };
