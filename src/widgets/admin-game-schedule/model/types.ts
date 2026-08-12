import { type AdminScheduleGameId } from "./admin-schedule-game";

export type AdminScheduledGame = {
  endDate: string;
  gameId: AdminScheduleGameId;
  id: string;
  startDate: string;
};
