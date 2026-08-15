import { type z } from "zod";

import { type gameSchedulesResponseDtoSchema } from "./game-schedules-response-schema";

export type GameSchedulesResponseDto = z.output<typeof gameSchedulesResponseDtoSchema>;
