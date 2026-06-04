import { useQuery } from "@tanstack/react-query";
import { miniApp, retrieveLaunchParams, viewport } from "@tma.js/sdk-react";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/shared/api";
import LotteryWidget from "@/widgets/lottery-widget";

type TelegramUser = {
  first_name?: string;
  username?: string;
};

type LotteryPageProps = {
  isTelegram: boolean;
};

export default function LotteryPage({ isTelegram }: LotteryPageProps) {
  const [user, setUser] = useState<TelegramUser | undefined>(undefined);

  const { data: apiData = "loading...", error: apiError } = useQuery({
    queryKey: ["health", "db"],
    queryFn: async ({ signal }) => {
      const response = await fetch(getApiUrl("health/db"), { signal });
      return response.text();
    },
  });

  useEffect(() => {
    if (!isTelegram) {
      return;
    }

    try {
      const launchParams = retrieveLaunchParams();
      const user = launchParams.tgWebAppData?.user as TelegramUser | undefined;
      setUser(user);

    } catch {
      console.log('Error')
    }

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

    if (viewport.mount.isAvailable()) {
      void viewport.mount().catch(() => undefined);
    }
    if (viewport.expand.isAvailable()) {
      viewport.expand();
    }
  }, [isTelegram]);

  return (
    <section className="page__body">
      <span style={{ color: "red", display: "block", fontSize: 32 }}>{user?.first_name}</span>
      <span style={{ color: "red", display: "block", fontSize: 32 }}>
        {apiError ? "backend error" : apiData}
      </span>
      <LotteryWidget />
    </section>
  );
}
