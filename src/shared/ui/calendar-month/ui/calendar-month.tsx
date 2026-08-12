import { type ReactNode, useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonCalendar } from "@/shared/ui/button-calendar";

import "./calendar-month.scss";

type CalendarMonthProps = {
  getDayAriaLabel?: (day: Dayjs) => string;
  month: Dayjs;
  onDayClick?: (day: Dayjs) => void;
  onMonthChange: (month: Dayjs) => void;
  selectedEndDay?: Dayjs;
  selectedStartDay?: Dayjs;
  renderDayContent?: (day: Dayjs) => ReactNode;
  weekStart?: 0 | 1;
};

const CALENDAR_WEEKS_COUNT = 6;

const DAYS_IN_WEEK = 7;

export function CalendarMonth({
  getDayAriaLabel,
  month,
  onDayClick,
  onMonthChange,
  selectedEndDay,
  selectedStartDay,
  renderDayContent,
  weekStart = 1
}: CalendarMonthProps) {
  const today = dayjs();
  const [selectingDay, setSelectingDay] = useState<Dayjs>();

  const monthStart = month.startOf("month");

  const leadingDaysCount = (monthStart.day() - weekStart + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const calendarStart = monthStart.subtract(leadingDaysCount, "day");
  const days = Array.from({ length: CALENDAR_WEEKS_COUNT * DAYS_IN_WEEK }, (_, index) =>
    calendarStart.add(index, "day")
  );

  const weekDays = days.slice(0, DAYS_IN_WEEK);
  const monthLabel = month.format("MMMM YYYY");

  return (
    <section className="calendar-month" aria-label={monthLabel}>
      <header className="calendar-month__header">
        <h2 className="calendar-month__title">{monthLabel}</h2>

        <div className="calendar-month__navigation-group">
          <ButtonBase
            type="button"
            aria-label="Previous month"
            className="calendar-month__navigation"
            onClick={() => onMonthChange(month.subtract(1, "month"))}
          >
            &larr;
          </ButtonBase>

          <ButtonBase
            type="button"
            aria-label="Next month"
            className="calendar-month__navigation"
            onClick={() => onMonthChange(month.add(1, "month"))}
          >
            &rarr;
          </ButtonBase>
        </div>
      </header>

      <div className="calendar-month__grid" onMouseLeave={() => setSelectingDay(undefined)}>
        {weekDays.map((day) => (
          <span key={day.day()} className="calendar-month__week-day" aria-label={day.format("dddd")}>
            {day.format("dd")}
          </span>
        ))}

        {days.map((day) => {
          const isCurrentMonth = day.isSame(month, "month");
          const isToday = day.isSame(today, "day");
          const isRangeStart = selectedStartDay?.isSame(day, "day") ?? false;
          const isRangeEnd = selectedEndDay?.isSame(day, "day") ?? false;
          const isInRange =
            selectedStartDay !== undefined &&
            selectedEndDay !== undefined &&
            day.isAfter(selectedStartDay, "day") &&
            day.isBefore(selectedEndDay, "day");
          const isInSelectingRange =
            selectedStartDay !== undefined &&
            selectedEndDay === undefined &&
            selectingDay !== undefined &&
            !selectingDay.isBefore(selectedStartDay, "day") &&
            !day.isBefore(selectedStartDay, "day") &&
            !day.isAfter(selectingDay, "day");
          const isSelectingRangeEnd = selectingDay?.isSame(day, "day") ?? false;

          return (
            <ButtonCalendar
              day={day}
              isToday={isToday}
              key={day.valueOf()}
              isInRange={isInRange}
              isRangeEnd={isRangeEnd}
              isRangeStart={isRangeStart}
              isCurrentMonth={isCurrentMonth}
              isInSelectingRange={isInSelectingRange}
              isSelectingRangeEnd={isSelectingRangeEnd}
              onClick={onDayClick ? () => onDayClick(day) : undefined}
              onMouseEnter={onDayClick && isCurrentMonth ? () => setSelectingDay(day) : undefined}
              ariaLabel={getDayAriaLabel?.(day)}
            >
              {isCurrentMonth ? renderDayContent?.(day) : null}
            </ButtonCalendar>
          );
        })}
      </div>
    </section>
  );
}
