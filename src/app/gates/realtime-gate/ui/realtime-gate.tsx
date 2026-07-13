import { useAttemptsWalletRealtimeSync } from "@/entities/attempts";
import { useMeRealtimeSync } from "@/entities/me";
import { useConsolationPrizeAwardedRealtimePopup } from "@/features/show-consolation-prize-award";
import { useRealtimeConnection } from "@/shared/lib/realtime";

export function RealtimeGate() {
  useRealtimeConnection();
  useAttemptsWalletRealtimeSync();
  useConsolationPrizeAwardedRealtimePopup();
  useMeRealtimeSync();

  return null;
}
