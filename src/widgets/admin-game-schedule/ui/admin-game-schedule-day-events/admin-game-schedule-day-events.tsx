import clsx from "clsx";

import { ADMIN_SCHEDULE_GAME_DETAILS, AdminScheduleGameId } from "../../model/admin-schedule-game";
import { type AdminScheduledGame } from "../../model/types";

import "./admin-game-schedule-day-events.scss";

type AdminGameScheduleDayEventsProps = {
  games: readonly AdminScheduledGame[];
};

export function AdminGameScheduleDayEvents({ games }: AdminGameScheduleDayEventsProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <span className="admin-game-schedule-day-events" aria-hidden="true">
      {games.map((game) => (
        <span
          key={game.id}
          className={clsx("admin-game-schedule-day-events__item", {
            "admin-game-schedule-day-events__item--crack-safe": game.gameId === AdminScheduleGameId.CrackSafe,
            "admin-game-schedule-day-events__item--lucky-meadow": game.gameId === AdminScheduleGameId.LuckyMeadow
          })}
        >
          <span className="admin-game-schedule-day-events__mark">
            {ADMIN_SCHEDULE_GAME_DETAILS[game.gameId].mark}
          </span>
          <span className="admin-game-schedule-day-events__name">
            {ADMIN_SCHEDULE_GAME_DETAILS[game.gameId].name}
          </span>
        </span>
      ))}
    </span>
  );
}
