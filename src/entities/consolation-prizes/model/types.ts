import { type z } from "zod";
import { type FieldNamesMarkedBoolean } from "react-hook-form";

import { type ConsolationPrizeDto } from "../api/types";
import { adminConsolationPrizeFormSchema } from "./admin-consolation-prize-form-schema";

export type AdminConsolationPrizeFormState = z.output<typeof adminConsolationPrizeFormSchema>;
export type AdminConsolationPrizeDirtyFields = Partial<
  Readonly<FieldNamesMarkedBoolean<AdminConsolationPrizeFormState>>
>;
export type ConsolationPrize = ConsolationPrizeDto;
export type ConsolationPrizeOption = { id: string; name: string };
