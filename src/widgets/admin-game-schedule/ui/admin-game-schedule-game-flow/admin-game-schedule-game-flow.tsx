import { type Dayjs } from "dayjs";

import { GameScheduleId, type ScheduledGame } from "@/entities/game-schedule";
import { CrackSafeScheduleFlow } from "@/features/admin-crack-safe-schedule";
import { AdminLuckyMeadowRuleUpdateModal } from "@/features/admin-update-lucky-meadow-rule";

import { type AdminScheduledGame } from "../../model/types";
import { getScheduleGameTitle } from "../../model/schedule-game-metadata";
import { AdminGameScheduleGameDay } from "../admin-game-schedule-game-day/admin-game-schedule-game-day";

type AdminGameScheduleGameFlowProps = {
  game: AdminScheduledGame;
  onClose: () => void;
  selectedDay: Dayjs;
  scheduledGames: readonly ScheduledGame[];
};

function renderScheduledGameDay(gameId: GameScheduleId) {
  return <AdminGameScheduleGameDay gameId={gameId} isCompact />;
}

export function AdminGameScheduleGameFlow({
  game,
  onClose,
  selectedDay,
  scheduledGames
}: AdminGameScheduleGameFlowProps) {
  if (game.gameId === GameScheduleId.CrackSafe) {
    return (
      <CrackSafeScheduleFlow
        game={game}
        getGameName={getScheduleGameTitle}
        onClose={onClose}
        renderScheduledGameDay={renderScheduledGameDay}
        rule={game.rule}
        selectedDay={selectedDay}
        scheduledGames={scheduledGames}
      />
    );
  }

  if (game.gameId === GameScheduleId.LuckyMeadow) {
    return (
      <AdminLuckyMeadowRuleUpdateModal
        getGameName={getScheduleGameTitle}
        isOpen
        onClose={onClose}
        renderScheduledGameDay={renderScheduledGameDay}
        rule={game.rule}
        scheduledGames={scheduledGames}
      />
    );
  }

  return null;
}
