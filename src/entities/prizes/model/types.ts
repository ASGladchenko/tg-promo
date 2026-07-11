import { type z } from "zod";

import { type PrizeDto, type UserPrizeDto } from "../api/types";
import { adminPrizeFormSchema } from "./admin-prize-form-schema";

export type AdminPrizeFormState = z.output<typeof adminPrizeFormSchema>;

export type Prize = Omit<PrizeDto, "description"> & {
  description: string;
};

export type UserPrizeOutcome = "jackpot" | "semiJackpot";

export type UserPrize = UserPrizeDto & {
  description: string | null;
  outcome: UserPrizeOutcome | null;
  promoCode: string | null;
};
