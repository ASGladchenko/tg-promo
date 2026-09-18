import * as z from "zod";

const gameScheduleGameTypeDtoSchema = z.enum(["crack-safe", "lucky-meadow"]);

export const activeGameScheduleResponseDtoSchema = z.object({
  endDate: z.string().nullable(),
  gameType: gameScheduleGameTypeDtoSchema.nullable(),
  scheduleId: z.string().nullable(),
  startDate: z.string().nullable()
});

export const gameSchedulesResponseDtoSchema = z.array(
  z.object({
    endDate: z.string(),
    gameType: gameScheduleGameTypeDtoSchema,
    startDate: z.string()
  })
);
