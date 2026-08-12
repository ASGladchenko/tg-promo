import { type ScheduledGame } from "@/entities/game-schedule";

export type AdminScheduledGame = ScheduledGame;

export type AdminSchedulePeriod = {
  endDate: string;
  label: string;
  startDate: string;
};

export type AdminSchedulePeriodConflict = {
  dateLabel: string;
  gameName: string;
};

export type AdminSchedulePeriodAvailability = {
  availablePeriods: AdminSchedulePeriod[];
  conflicts: AdminSchedulePeriodConflict[];
};
