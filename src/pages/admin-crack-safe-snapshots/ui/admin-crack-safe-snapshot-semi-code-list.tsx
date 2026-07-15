import { type getAdminCrackSafeSnapshotSemiCodes } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotSemiCodeRow } from "./admin-crack-safe-snapshot-semi-code-row";

type AdminCrackSafeSnapshotSemiCodeListProps = {
  semiCodes: ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
  wonSemiCodes: Set<string>;
};

export function AdminCrackSafeSnapshotSemiCodeList({
  semiCodes,
  usedPromoCodes,
  wonSemiCodes
}: AdminCrackSafeSnapshotSemiCodeListProps) {
  return (
    <div className="admin-crack-safe-snapshot-details__semi-codes">
      <div className="admin-crack-safe-snapshot-details__semi-code admin-crack-safe-snapshot-details__semi-code--head">
        <span>Safe Code</span>
        <span>Status</span>
        <span>Promo Code</span>
      </div>

      {semiCodes.map((semiCode) => (
        <AdminCrackSafeSnapshotSemiCodeRow
          key={semiCode.promoCode}
          semiCode={semiCode}
          usedPromoCodes={usedPromoCodes}
          wonSemiCodes={wonSemiCodes}
        />
      ))}
    </div>
  );
}
