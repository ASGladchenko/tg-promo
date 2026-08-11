import dayjs, { type Dayjs } from "dayjs";

import { ButtonCalendar } from "@/shared/ui/button-calendar";

import "./calendar-month.scss";

type CalendarMonthProps = {
  month: Dayjs;
  onDayClick?: (day: Dayjs) => void;
  selectedDay?: Dayjs;
  weekStart?: 0 | 1;
};

const CALENDAR_WEEKS_COUNT = 6;
const DAYS_IN_WEEK = 7;

export function CalendarMonth({ month, onDayClick, selectedDay, weekStart = 1 }: CalendarMonthProps) {
  const today = dayjs();
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
      <h2 className="calendar-month__title">{monthLabel}</h2>

      <div className="calendar-month__grid">
        {weekDays.map((day) => (
          <span key={day.day()} className="calendar-month__week-day" aria-label={day.format("dddd")}>
            {day.format("dd")}
          </span>
        ))}

        {days.map((day) => {
          const isCurrentMonth = day.isSame(month, "month");
          const isToday = day.isSame(today, "day");
          const isSelected = selectedDay?.isSame(day, "day") ?? false;

          return (
            <ButtonCalendar
              key={day.valueOf()}
              day={day}
              isCurrentMonth={isCurrentMonth}
              isSelected={isSelected}
              isToday={isToday}
              onClick={onDayClick ? () => onDayClick(day) : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
