import { type ReactNode } from "react";

import { Dayjs } from "dayjs";

export type ButtonCalendarProps = {
  ariaLabel?: string;
  children?: ReactNode;
  day: Dayjs;
  isCurrentMonth: boolean;
  isInRange: boolean;
  isInSelectingRange: boolean;
  isRangeEnd: boolean;
  isRangeStart: boolean;
  isSelectingRangeEnd: boolean;
  isToday: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
};
