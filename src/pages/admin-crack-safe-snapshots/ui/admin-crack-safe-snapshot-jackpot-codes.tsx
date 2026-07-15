import { type CrackSafeSnapshot, type CrackSafeSnapshotCode } from "@/entities/crack-safe-snapshots";

import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotJackpotCodeList } from "./admin-crack-safe-snapshot-jackpot-code-list";
import { AdminCrackSafeSnapshotJackpotPromoCodes } from "./admin-crack-safe-snapshot-jackpot-promo-codes";

type AdminCrackSafeSnapshotJackpotCodesProps = {
  jackpotCodes: CrackSafeSnapshotCode[];
  snapshot: CrackSafeSnapshot;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
};

export function AdminCrackSafeSnapshotJackpotCodes({
  jackpotCodes,
  snapshot,
  usedPromoCodes
}: AdminCrackSafeSnapshotJackpotCodesProps) {
  const jackpotPrize = snapshot.jackpotPrize;

  let content = (
    <AdminCrackSafeSnapshotJackpotCodeList jackpotCodes={jackpotCodes} jackpotPrize={jackpotPrize} />
  );

  if (!jackpotCodes.length && jackpotPrize) {
    content = (
      <AdminCrackSafeSnapshotJackpotPromoCodes
        promoCodes={jackpotPrize.promoCodes}
        usedPromoCodes={usedPromoCodes.jackpot}
      />
    );
  }

  if (!jackpotCodes.length && !jackpotPrize) {
    content = <code>None</code>;
  }

  return <div className="admin-crack-safe-snapshot-details__prize-card">{content}</div>;
}
