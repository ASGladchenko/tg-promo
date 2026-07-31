import { type z } from "zod";

import { usersAnalyticsResponseDtoSchema } from "./users-analytics-response-schema";

export type UsersAnalyticsResponseDto = z.output<typeof usersAnalyticsResponseDtoSchema>;
