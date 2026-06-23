import { useAttemptsWalletRealtimeSync } from "@/entities/attempts";
import { useMeRealtimeSync } from "@/entities/me";
import { useRealtimeConnection } from "@/shared/lib/realtime";

export function RealtimeGate() {
  useRealtimeConnection();
  useAttemptsWalletRealtimeSync();
  useMeRealtimeSync();

  return null;
}
