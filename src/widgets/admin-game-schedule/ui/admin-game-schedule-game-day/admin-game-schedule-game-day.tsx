import { GameScheduleId } from "@/entities/game-schedule";
import { CrackSafeScheduleDay } from "@/features/admin-crack-safe-schedule";
import { LuckyMeadowScheduleDay } from "@/features/admin-lucky-meadow-schedule";

const SCHEDULE_GAME_DAY_COMPONENTS = {
  [GameScheduleId.CrackSafe]: CrackSafeScheduleDay,
  [GameScheduleId.LuckyMeadow]: LuckyMeadowScheduleDay
} as const;

type AdminGameScheduleGameDayProps = {
  gameId: GameScheduleId;
};

export function AdminGameScheduleGameDay({ gameId }: AdminGameScheduleGameDayProps) {
  const ScheduleGameDay = SCHEDULE_GAME_DAY_COMPONENTS[gameId];

  return <ScheduleGameDay />;
}
