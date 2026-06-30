import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { useTimer } from "@/shared/lib/timer";

function getNextUtcMidnightTimestamp(): number {
  const now = new Date();

  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
}

function padTimerPart(value: number): string {
  return String(value).padStart(2, "0");
}

function formatTimerTime(hours: number, minutes: number, seconds: number): string {
  return `${padTimerPart(hours)}:${padTimerPart(minutes)}:${padTimerPart(seconds)}`;
}

export function AttemptsWalletDailyExpirationNote() {
  const { t } = useTranslation();
  const [expiresAt, setExpiresAt] = useState(() => getNextUtcMidnightTimestamp());
  const timer = useTimer({
    mode: "to",
    moment: expiresAt
  });

  useEffect(() => {
    if (timer.isComplete) {
      setExpiresAt(getNextUtcMidnightTimestamp());
    }
  }, [timer.isComplete]);

  return (
    <span className="attempts-wallet-modal__daily-note">
      {t("attempts.dailyExpires", {
        time: formatTimerTime(timer.hours, timer.minutes, timer.seconds)
      })}
    </span>
  );
}
