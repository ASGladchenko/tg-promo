import { useAttemptsWalletRealtimeSync } from "@/entities/attempts";
import { useConsolationPrizeAwardedRealtimeSync } from "@/entities/consolation-prizes";
import { useMeRealtimeSync } from "@/entities/me";
import { useRealtimeConnection } from "@/shared/lib/realtime";

export function RealtimeGate() {
  useRealtimeConnection();
  useAttemptsWalletRealtimeSync();
  useConsolationPrizeAwardedRealtimeSync();
  useMeRealtimeSync();

  return null;
}
