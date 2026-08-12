import { type Dayjs } from "dayjs";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { CrackSafeScheduleFlow } from "@/features/admin-crack-safe-schedule";
import { LuckyMeadowScheduleFlow } from "@/features/admin-lucky-meadow-schedule";

const SCHEDULE_GAME_FLOW_COMPONENTS = {
  [GameScheduleId.CrackSafe]: CrackSafeScheduleFlow,
  [GameScheduleId.LuckyMeadow]: LuckyMeadowScheduleFlow
} as const;

type AdminGameScheduleGameFlowProps = {
  game: ScheduledGame;
  onClose: () => void;
  selectedDay: Dayjs;
};

export function AdminGameScheduleGameFlow({ game, onClose, selectedDay }: AdminGameScheduleGameFlowProps) {
  const ScheduleGameFlow = SCHEDULE_GAME_FLOW_COMPONENTS[game.gameId];

  return <ScheduleGameFlow game={game} onClose={onClose} selectedDay={selectedDay} />;
}
