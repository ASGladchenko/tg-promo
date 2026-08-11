import dayjs from "dayjs";
import { useState } from "react";

import { AdminPageHeader } from "@/shared/ui/admin-page-header";
import { CalendarMonth } from "@/shared/ui/calendar-month";

import "./admin-schedule.scss";

export function AdminSchedule() {
  const [selectedDay, setSelectedDay] = useState(() => dayjs());

  return (
    <section className="admin-schedule">
      <AdminPageHeader title="Schedule" />
      <CalendarMonth month={dayjs()} selectedDay={selectedDay} onDayClick={setSelectedDay} />
    </section>
  );
}
