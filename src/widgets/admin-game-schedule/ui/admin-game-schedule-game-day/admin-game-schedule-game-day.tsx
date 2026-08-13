import clsx from "clsx";

import { GameScheduleId } from "@/entities/game-schedule";

import { scheduleGameMetadata } from "../../model/schedule-game-metadata";

import "./admin-game-schedule-game-day.scss";

type AdminGameScheduleGameDayProps = {
  gameId: GameScheduleId;
};

export function AdminGameScheduleGameDay({ gameId }: AdminGameScheduleGameDayProps) {
  const game = scheduleGameMetadata[gameId];

  return (
    <span
      className={clsx("admin-game-schedule-game-day", {
        "admin-game-schedule-game-day--warning": game.tone === "warning"
      })}
      aria-hidden="true"
    >
      <span className="admin-game-schedule-game-day__mark">{game.mark}</span>
      <span className="admin-game-schedule-game-day__name">{game.title}</span>
    </span>
  );
}
