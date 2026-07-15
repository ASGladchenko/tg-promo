import { type CrackSafeSnapshot } from "@/entities/crack-safe-snapshots";

import { type getAdminCrackSafeSnapshotSemiCodes } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotSemiCodeList } from "./admin-crack-safe-snapshot-semi-code-list";

type AdminCrackSafeSnapshotSemiCodesProps = {
  semiCodes: ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>;
  snapshot: CrackSafeSnapshot;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
  wonSemiCodes: Set<string>;
};

export function AdminCrackSafeSnapshotSemiCodes({
  semiCodes,
  snapshot,
  usedPromoCodes,
  wonSemiCodes
}: AdminCrackSafeSnapshotSemiCodesProps) {
  let content = <code>None</code>;

  if (snapshot.semiJackpotPrize) {
    content = (
      <AdminCrackSafeSnapshotSemiCodeList
        semiCodes={semiCodes}
        usedPromoCodes={usedPromoCodes}
        wonSemiCodes={wonSemiCodes}
      />
    );
  }

  return <div className="admin-crack-safe-snapshot-details__prize-card">{content}</div>;
}
