import clsx from "clsx";

import { GameScheduleId } from "@/entities/game-schedule";

import { scheduleGameMetadata } from "../../model/schedule-game-metadata";

import "./admin-game-schedule-game-day.scss";

type AdminGameScheduleGameDayProps = {
  gameId: GameScheduleId;
  isCompact?: boolean;
};

export function AdminGameScheduleGameDay({ gameId, isCompact = false }: AdminGameScheduleGameDayProps) {
  const game = scheduleGameMetadata[gameId];

  return (
    <span
      className={clsx("admin-game-schedule-game-day", {
        "admin-game-schedule-game-day--compact": isCompact,
        "admin-game-schedule-game-day--warning": game.tone === "warning"
      })}
      aria-hidden="true"
    >
      <span className="admin-game-schedule-game-day__mark">{game.mark}</span>
      <span className="admin-game-schedule-game-day__name">{game.title}</span>
    </span>
  );
}
