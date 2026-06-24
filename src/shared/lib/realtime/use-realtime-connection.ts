import { useEffect } from "react";

import { getApiUrl } from "@/shared/api";

import { realtimeClient } from "./realtime-client";

export function useRealtimeConnection(): void {
  useEffect(() => {
    realtimeClient.connect(getApiUrl("client-events/stream"));

    return () => {
      realtimeClient.disconnect();
    };
  }, []);
}
