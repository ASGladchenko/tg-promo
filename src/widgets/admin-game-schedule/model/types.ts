import { GameScheduleId } from "@/entities/game-schedule";

export type AdminSchedulePeriod = {
  endDate: string;
  label: string;
  startDate: string;
};

export type AdminSchedulePeriodConflict = {
  dateLabel: string;
  gameId: GameScheduleId;
};

export type AdminSchedulePeriodAvailability = {
  availablePeriods: AdminSchedulePeriod[];
  conflicts: AdminSchedulePeriodConflict[];
};
