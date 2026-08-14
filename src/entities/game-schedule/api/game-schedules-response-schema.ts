import * as z from "zod";

export const gameSchedulesResponseDtoSchema = z.array(
  z.object({
    endDate: z.string(),
    gameType: z.enum(["crack-safe", "lucky-meadow"]),
    startDate: z.string()
  })
);
