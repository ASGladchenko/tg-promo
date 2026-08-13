import { type Dayjs } from "dayjs";

import { type ScheduledGame } from "@/entities/game-schedule";
import { useLuckyMeadowRules } from "@/entities/lucky-meadow";
import { AdminLuckyMeadowRuleUpdateModal } from "@/features/admin-update-lucky-meadow-rule";

type LuckyMeadowScheduleFlowProps = {
  game: ScheduledGame;
  onClose: () => void;
  selectedDay: Dayjs;
};

export function LuckyMeadowScheduleFlow({ game, onClose, selectedDay }: LuckyMeadowScheduleFlowProps) {
  const luckyMeadowRulesQuery = useLuckyMeadowRules();

  const rule = luckyMeadowRulesQuery.data?.find((item) => item.scheduleId === game.id);

  void selectedDay;

  return <AdminLuckyMeadowRuleUpdateModal isOpen={rule !== undefined} onClose={onClose} rule={rule} />;
}
