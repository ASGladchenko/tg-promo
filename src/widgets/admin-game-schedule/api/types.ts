import { type z } from "zod";

import { type gamesCalendarRulesResponseDtoSchema } from "./games-calendar-rules-response-schema";

export type GamesCalendarRulesResponseDto = z.output<typeof gamesCalendarRulesResponseDtoSchema>;
