import { useEffect, useMemo, useState } from "react";

export type TimerMode = "from" | "to";

export type TimerMoment = Date | number | string;

export type TimerParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type UseTimerOptions = {
  isEnabled?: boolean;
  mode: TimerMode;
  moment: TimerMoment | null | undefined;
};

export type UseTimerResult = TimerParts & {
  isComplete: boolean;
  isRunning: boolean;
  isValid: boolean;
  milliseconds: number;
  mode: TimerMode;
  timestamp: number | null;
  totalSeconds: number;
};

const TIMER_INTERVAL_MS = 1000;
const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

function resolveTimestamp(moment: TimerMoment | null | undefined): number | null {
  if (moment === null || moment === undefined) {
    return null;
  }

  const timestamp = moment instanceof Date ? moment.getTime() : new Date(moment).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function getTimerMilliseconds(mode: TimerMode, timestamp: number, now: number): number {
  const milliseconds = mode === "to" ? timestamp - now : now - timestamp;

  return Math.max(0, milliseconds);
}

function getTimerParts(totalSeconds: number): TimerParts {
  const days = Math.floor(totalSeconds / SECONDS_IN_DAY);
  const hours = Math.floor((totalSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

export function useTimer({ isEnabled = true, mode, moment }: UseTimerOptions): UseTimerResult {
  const timestamp = useMemo(() => resolveTimestamp(moment), [moment]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isEnabled || timestamp === null) {
      return;
    }

    const currentNow = Date.now();

    setNow(currentNow);

    if (mode === "to" && currentNow >= timestamp) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextNow = Date.now();

      setNow(nextNow);

      if (mode === "to" && nextNow >= timestamp) {
        window.clearInterval(intervalId);
      }
    }, TIMER_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isEnabled, mode, timestamp]);

  const isValid = timestamp !== null;
  const milliseconds = isValid ? getTimerMilliseconds(mode, timestamp, now) : 0;
  const totalSeconds = Math.floor(milliseconds / MS_IN_SECOND);
  const parts = getTimerParts(totalSeconds);
  const isComplete = isValid && mode === "to" && now >= timestamp;

  return {
    ...parts,
    isComplete,
    isRunning: isEnabled && isValid && !isComplete,
    isValid,
    milliseconds,
    mode,
    timestamp,
    totalSeconds
  };
}
