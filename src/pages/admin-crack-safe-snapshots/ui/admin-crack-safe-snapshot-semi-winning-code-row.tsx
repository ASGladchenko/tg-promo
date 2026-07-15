import clsx from "clsx";

import { Badge } from "@/shared/ui/badge";

import { type AdminCrackSafeSnapshotSemiWinningCode } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";

import "./admin-crack-safe-snapshot-semi-winning-code-row.scss";

type AdminCrackSafeSnapshotSemiWinningCodeRowProps = {
  semiCode: AdminCrackSafeSnapshotSemiWinningCode;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
};

export function AdminCrackSafeSnapshotSemiWinningCodeRow({
  semiCode,
  usedPromoCodes
}: AdminCrackSafeSnapshotSemiWinningCodeRowProps) {
  const issuedPromoCodes = semiCode.issuedPromoCodes;
  const winsLabel = `${semiCode.winsCount}x`;

  return (
    <div className="admin-crack-safe-snapshot-details__semi-winning-code">
      <span
        className={clsx("admin-crack-safe-snapshot-details__semi-safe-code", {
          "admin-crack-safe-snapshot-details__semi-safe-code--won": semiCode.winsCount > 0
        })}
      >
        {semiCode.code}
      </span>

      <span
        className={clsx("admin-crack-safe-snapshot-details__semi-code-status", {
          "admin-crack-safe-snapshot-details__semi-code-status--available": semiCode.winsCount === 0,
          "admin-crack-safe-snapshot-details__semi-code-status--used": semiCode.winsCount > 0
        })}
      >
        {winsLabel}
      </span>

      {issuedPromoCodes.length ? (
        <span className="admin-crack-safe-snapshot-details__issued-promo-codes">
          {issuedPromoCodes.map((promoCode, index) => (
            <Badge
              isStruck
              key={`${promoCode}-${index}`}
              variant={usedPromoCodes.expiredSemiJackpot.has(promoCode) ? "danger" : "warning"}
            >
              {promoCode}
            </Badge>
          ))}
        </span>
      ) : (
        <span className="admin-crack-safe-snapshot-details__empty-value">None</span>
      )}
    </div>
  );
}
