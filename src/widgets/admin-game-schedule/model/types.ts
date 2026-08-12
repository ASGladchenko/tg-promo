import { type CrackSafeRule } from "@/entities/crack-safe-rules";

import { type AdminScheduleGameId } from "./admin-schedule-game";

export type AdminScheduledGame = {
  crackSafeRule?: CrackSafeRule;
  endDate: string;
  gameId: AdminScheduleGameId;
  id: string;
  startDate: string;
};

export type AdminSchedulePeriod = {
  endDate: string;
  label: string;
  startDate: string;
};

export type AdminSchedulePeriodConflict = {
  dateLabel: string;
  gameIds: AdminScheduleGameId[];
};

export type AdminSchedulePeriodAvailability = {
  availablePeriods: AdminSchedulePeriod[];
  conflicts: AdminSchedulePeriodConflict[];
};
