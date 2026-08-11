import type { Dayjs } from "dayjs";

import clsx from "clsx";

import { ButtonBase } from "@/shared/ui/button-base";

import "./button-calendar.scss";

type ButtonCalendarProps = {
  day: Dayjs;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  onClick?: () => void;
};

export function ButtonCalendar({ day, isCurrentMonth, isSelected, isToday, onClick }: ButtonCalendarProps) {
  const canSelectDay = isCurrentMonth && onClick !== undefined;

  return (
    <ButtonBase
      type="button"
      className={clsx("button-calendar", {
        "button-calendar--outside-month": !isCurrentMonth,
        "button-calendar--selected": isSelected,
        "button-calendar--today": isToday
      })}
      disabled={!canSelectDay}
      aria-current={isToday ? "date" : undefined}
      aria-label={day.format("D MMMM YYYY")}
      aria-pressed={canSelectDay ? isSelected : undefined}
      onClick={onClick}
    >
      <time dateTime={day.format("YYYY-MM-DD")}>{day.format("D")}</time>
    </ButtonBase>
  );
}
