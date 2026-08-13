import { type Dayjs } from "dayjs";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { CrackSafeScheduleFlow } from "@/features/admin-crack-safe-schedule";

import { type AdminScheduledGame } from "../../model/types";
import { getScheduleGameTitle } from "../../model/schedule-game-metadata";
import { AdminGameScheduleGameDay } from "../admin-game-schedule-game-day/admin-game-schedule-game-day";
import { LuckyMeadowScheduleFlow } from "./lucky-meadow-schedule-flow";

type AdminGameScheduleGameFlowProps = {
  game: AdminScheduledGame;
  onClose: () => void;
  onRulesChange: () => void;
  selectedDay: Dayjs;
  scheduledGames: readonly ScheduledGame[];
};

function renderScheduledGameDay(gameId: GameScheduleId) {
  return <AdminGameScheduleGameDay gameId={gameId} isCompact />;
}

export function AdminGameScheduleGameFlow({
  game,
  onClose,
  onRulesChange,
  selectedDay,
  scheduledGames
}: AdminGameScheduleGameFlowProps) {
  if (game.gameId === GameScheduleId.CrackSafe) {
    return (
      <CrackSafeScheduleFlow
        getGameName={getScheduleGameTitle}
        onClose={onClose}
        onRulesChange={onRulesChange}
        renderScheduledGameDay={renderScheduledGameDay}
        rule={game.rule}
        selectedDay={selectedDay}
        scheduledGames={scheduledGames}
        startDate={game.startDate}
      />
    );
  }

  if (game.gameId === GameScheduleId.LuckyMeadow) {
    return (
      <LuckyMeadowScheduleFlow
        getGameName={getScheduleGameTitle}
        onClose={onClose}
        onRulesChange={onRulesChange}
        renderScheduledGameDay={renderScheduledGameDay}
        rule={game.rule}
        selectedDay={selectedDay}
        scheduledGames={scheduledGames}
        startDate={game.startDate}
      />
    );
  }

  return null;
}
