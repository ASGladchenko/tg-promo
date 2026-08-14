import { type GameSchedulesResponseDto } from "../api/types";
import { GameScheduleId, type ScheduledGame } from "../model/types";

export function mapGameSchedulesResponseToScheduledGames(response: GameSchedulesResponseDto): ScheduledGame[] {
  return response
    .map((schedule) => ({
      endDate: schedule.endDate,
      gameId: schedule.gameType === "crack-safe" ? GameScheduleId.CrackSafe : GameScheduleId.LuckyMeadow,
      startDate: schedule.startDate
    }))
    .sort((left, right) => left.startDate.localeCompare(right.startDate));
}
