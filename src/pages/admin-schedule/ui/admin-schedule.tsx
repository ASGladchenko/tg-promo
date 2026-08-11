import { useState } from "react";

import dayjs, { type Dayjs } from "dayjs";

import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { CalendarMonth } from "@/shared/ui/calendar-month";

import "./admin-schedule.scss";

export function AdminSchedule() {
  const [month, setMonth] = useState(() => dayjs());
  const [selectedEndDay, setSelectedEndDay] = useState<Dayjs>();
  const [selectedStartDay, setSelectedStartDay] = useState<Dayjs>();

  const handleDayClick = (day: Dayjs) => {
    if (
      selectedStartDay === undefined ||
      selectedEndDay !== undefined ||
      day.isBefore(selectedStartDay, "day")
    ) {
      setSelectedStartDay(day);
      setSelectedEndDay(undefined);

      return;
    }

    setSelectedEndDay(day);
  };

  return (
    <section className="admin-schedule">
      <AdminPageHeader title="Schedule" />
      <CalendarMonth
        month={month}
        onMonthChange={setMonth}
        onDayClick={handleDayClick}
        selectedEndDay={selectedEndDay}
        selectedStartDay={selectedStartDay}
      />
    </section>
  );
}
