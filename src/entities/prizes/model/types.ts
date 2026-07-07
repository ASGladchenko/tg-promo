import { type z } from "zod";

import { type PrizeDto } from "../api/types";
import { adminPrizeFormSchema } from "./admin-prize-form-schema";

export type AdminPrizeFormState = z.output<typeof adminPrizeFormSchema>;

export type Prize = Omit<PrizeDto, "description"> & {
  description: string;
};
