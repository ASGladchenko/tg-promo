import { type CrackSafeRule } from "@/entities/crack-safe-rules";
import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { type LuckyMeadowRule } from "@/entities/lucky-meadow";

export type AdminScheduledGame =
  | (ScheduledGame & {
      gameId: GameScheduleId.CrackSafe;
      rule: CrackSafeRule;
    })
  | (ScheduledGame & {
      gameId: GameScheduleId.LuckyMeadow;
      rule: LuckyMeadowRule;
    });

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
