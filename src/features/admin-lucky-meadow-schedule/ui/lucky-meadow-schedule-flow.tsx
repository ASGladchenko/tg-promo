import { type Dayjs } from "dayjs";

import { type ScheduledGame } from "@/entities/game-schedule";

type LuckyMeadowScheduleFlowProps = {
  game: ScheduledGame;
  onClose: () => void;
  selectedDay: Dayjs;
};

export function LuckyMeadowScheduleFlow({ game, onClose, selectedDay }: LuckyMeadowScheduleFlowProps) {
  void game;
  void onClose;
  void selectedDay;

  return null;
}
