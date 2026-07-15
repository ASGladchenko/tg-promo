import clsx from "clsx";

import { type getAdminCrackSafeSnapshotSemiCodes } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";

type AdminCrackSafeSnapshotSemiCode = ReturnType<typeof getAdminCrackSafeSnapshotSemiCodes>[number];
type AdminCrackSafeSnapshotSemiCodeRowProps = {
  semiCode: AdminCrackSafeSnapshotSemiCode;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
  wonSemiCodes: Set<string>;
};

export function AdminCrackSafeSnapshotSemiCodeRow({
  semiCode,
  usedPromoCodes,
  wonSemiCodes
}: AdminCrackSafeSnapshotSemiCodeRowProps) {
  const { codes, promoCode } = semiCode;
  const isExpired = usedPromoCodes.expiredSemiJackpot.has(promoCode);
  const isUsed = usedPromoCodes.semiJackpot.has(promoCode);
  const hasWonCode = codes.some((code) => wonSemiCodes.has(code));

  return (
    <div className="admin-crack-safe-snapshot-details__semi-code">
      <span className="admin-crack-safe-snapshot-details__semi-safe-codes">
        {codes.map((code) => (
          <span
            className={clsx("admin-crack-safe-snapshot-details__semi-safe-code", {
              "admin-crack-safe-snapshot-details__semi-safe-code--expired":
                isExpired || (isUsed && hasWonCode && !wonSemiCodes.has(code)),
              "admin-crack-safe-snapshot-details__semi-safe-code--won": wonSemiCodes.has(code)
            })}
            key={code}
          >
            {code}
          </span>
        ))}
      </span>

      <span
        className={clsx("admin-crack-safe-snapshot-details__semi-code-status", {
          "admin-crack-safe-snapshot-details__semi-code-status--available": !isUsed,
          "admin-crack-safe-snapshot-details__semi-code-status--expired": isExpired,
          "admin-crack-safe-snapshot-details__semi-code-status--used": isUsed && !isExpired
        })}
      >
        {isExpired ? "Expired" : isUsed ? "Won" : "Available"}
      </span>

      <span
        className={clsx("admin-crack-safe-snapshot-details__promo-code", {
          "admin-crack-safe-snapshot-details__promo-code--expired": isExpired,
          "admin-crack-safe-snapshot-details__promo-code--used": isUsed
        })}
      >
        {promoCode}
      </span>
    </div>
  );
}
