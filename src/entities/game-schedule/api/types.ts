import { type z } from "zod";

import {
  type activeGameScheduleResponseDtoSchema,
  type gameSchedulesResponseDtoSchema
} from "./game-schedules-response-schema";

export type ActiveGameScheduleResponseDto = z.output<typeof activeGameScheduleResponseDtoSchema>;
export type GameSchedulesResponseDto = z.output<typeof gameSchedulesResponseDtoSchema>;
