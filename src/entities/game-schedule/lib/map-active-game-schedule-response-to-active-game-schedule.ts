import { type ActiveGameScheduleResponseDto } from "../api/types";
import { type ActiveGameSchedule, GameScheduleId } from "../model/types";

const gameIdMap: Record<NonNullable<ActiveGameScheduleResponseDto["gameType"]>, GameScheduleId> = {
  "crack-safe": GameScheduleId.CrackSafe,
  "lucky-meadow": GameScheduleId.LuckyMeadow
};

export function mapActiveGameScheduleResponseToActiveGameSchedule(
  response: ActiveGameScheduleResponseDto
): ActiveGameSchedule {
  return {
    endDate: response.endDate,
    gameId: response.gameType ? gameIdMap[response.gameType] : null,
    scheduleId: response.scheduleId,
    startDate: response.startDate
  };
}
