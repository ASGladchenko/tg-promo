import clsx from "clsx";

import { ButtonBase } from "@/shared/ui/button-base";

import { ButtonCalendarProps } from "./types";

import "./button-calendar.scss";

export function ButtonCalendar({
  day,
  isToday,
  onClick,
  isInRange,
  isRangeEnd,
  onMouseEnter,
  isRangeStart,
  isCurrentMonth,
  isInSelectingRange,
  isSelectingRangeEnd
}: ButtonCalendarProps) {
  const canSelectDay = isCurrentMonth && onClick !== undefined;

  const buttonClassName = clsx("button-calendar", {
    "button-calendar--outside-month": !isCurrentMonth,
    "button-calendar--in-range": isInRange,
    "button-calendar--in-selecting-range": isInSelectingRange,
    "button-calendar--range-end": isRangeEnd,
    "button-calendar--range-start": isRangeStart,
    "button-calendar--selecting-range-end": isSelectingRangeEnd,
    "button-calendar--today": isToday
  });

  return (
    <ButtonBase
      type="button"
      onClick={onClick}
      disabled={!canSelectDay}
      onMouseEnter={onMouseEnter}
      className={buttonClassName}
      aria-label={day.format("D MMMM YYYY")}
      aria-current={isToday ? "date" : undefined}
      aria-pressed={canSelectDay ? isRangeStart || isRangeEnd : undefined}
    >
      <time dateTime={day.format("YYYY-MM-DD")}>{day.format("D")}</time>
    </ButtonBase>
  );
}
