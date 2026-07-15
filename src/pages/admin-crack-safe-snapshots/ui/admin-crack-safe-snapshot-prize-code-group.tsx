import clsx from "clsx";

import ChevronDownIcon from "@/shared/svg/chevron-down.svg?react";
import { Badge, type BadgeVariant } from "@/shared/ui/badge";

import { type AdminCrackSafeSnapshotSemiCodeGroup } from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { type getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotSemiWinningCodeRow } from "./admin-crack-safe-snapshot-semi-winning-code-row";

import "./admin-crack-safe-snapshot-prize-code-group.scss";

type AdminCrackSafeSnapshotPrizeCodeGroupProps = {
  group: AdminCrackSafeSnapshotSemiCodeGroup;
  isDefaultOpen: boolean;
  usedPromoCodes: ReturnType<typeof getAdminCrackSafeSnapshotUsedPromoCodes>;
};

export function AdminCrackSafeSnapshotPrizeCodeGroup({
  group,
  isDefaultOpen,
  usedPromoCodes
}: AdminCrackSafeSnapshotPrizeCodeGroupProps) {
  const { expiredSemiPromoCodes, issuedSemiCount, jackpotCode, jackpotPromoCode, semiCodes, semiPromoCodes } =
    group;
  const issuedSemiLabel = jackpotCode ? `${issuedSemiCount} / ${semiPromoCodes.length}` : "Not activated";
  const jackpotPromoLabel = jackpotPromoCode ?? "None";
  const hasUsedJackpotPromo = jackpotPromoCode ? usedPromoCodes.jackpot.has(jackpotPromoCode) : false;
  const hasExpiredJackpotPromo = jackpotPromoCode
    ? usedPromoCodes.expiredJackpot.has(jackpotPromoCode)
    : false;
  const jackpotStatus = hasExpiredJackpotPromo ? "Expired" : (jackpotCode?.status ?? "Not activated");
  const safeCodeLabel = jackpotCode?.code ?? "Pending";
  const semiCodesLabel = jackpotCode ? `${semiCodes.length} semi codes` : "Semi pending";
  const semiPromoCodesLabel = `${semiPromoCodes.length} semi promo`;
  const issuedSemiPromoCodes = new Set(semiCodes.flatMap((semiCode) => semiCode.issuedPromoCodes));
  const expiredPromoCodes = [
    ...(hasExpiredJackpotPromo && jackpotPromoCode ? [jackpotPromoCode] : []),
    ...expiredSemiPromoCodes
  ];

  const getSemiPromoBadgeVariant = (promoCode: string): BadgeVariant => {
    if (usedPromoCodes.expiredSemiJackpot.has(promoCode)) {
      return "danger";
    }

    if (issuedSemiPromoCodes.has(promoCode)) {
      return "warning";
    }

    return "secondary";
  };

  return (
    <details className="admin-crack-safe-snapshot-details__jackpot-group" open={isDefaultOpen}>
      <summary className="admin-crack-safe-snapshot-details__jackpot-group-summary">
        <ChevronDownIcon
          className="admin-crack-safe-snapshot-details__jackpot-group-chevron"
          aria-hidden="true"
          focusable="false"
        />
        <span className="admin-crack-safe-snapshot-details__jackpot-group-code">{safeCodeLabel}</span>
        <span
          className={clsx("admin-crack-safe-snapshot-details__jackpot-code-status", {
            "admin-crack-safe-snapshot-details__jackpot-code-status--active":
              jackpotCode?.status === "active",
            "admin-crack-safe-snapshot-details__jackpot-code-status--expired": hasExpiredJackpotPromo,
            "admin-crack-safe-snapshot-details__jackpot-code-status--pending": !jackpotCode,
            "admin-crack-safe-snapshot-details__jackpot-code-status--won": jackpotCode?.status === "won"
          })}
        >
          {jackpotStatus}
        </span>
        <span
          className={clsx("admin-crack-safe-snapshot-details__jackpot-code-promo", {
            "admin-crack-safe-snapshot-details__jackpot-code-promo--expired": hasExpiredJackpotPromo,
            "admin-crack-safe-snapshot-details__jackpot-code-promo--used": hasUsedJackpotPromo
          })}
        >
          {jackpotPromoLabel}
        </span>
        <span>{semiCodesLabel}</span>
        <span>{semiPromoCodesLabel}</span>
        <strong>{issuedSemiLabel}</strong>
      </summary>

      <div className="admin-crack-safe-snapshot-details__semi-card">
        <fieldset className="admin-crack-safe-snapshot-details__group-promo-pool">
          <legend>Promo codes</legend>
          <div className="admin-crack-safe-snapshot-details__group-promo-list">
            {semiPromoCodes.length ? (
              semiPromoCodes.map((promoCode) => (
                <Badge
                  isStruck={
                    usedPromoCodes.expiredSemiJackpot.has(promoCode) || issuedSemiPromoCodes.has(promoCode)
                  }
                  key={promoCode}
                  variant={getSemiPromoBadgeVariant(promoCode)}
                >
                  {promoCode}
                </Badge>
              ))
            ) : (
              <span className="admin-crack-safe-snapshot-details__empty-value">None</span>
            )}
          </div>
        </fieldset>

        {jackpotCode ? (
          <div className="admin-crack-safe-snapshot-details__semi-winning-codes">
            <div className="admin-crack-safe-snapshot-details__semi-winning-code admin-crack-safe-snapshot-details__semi-winning-code--head">
              <span>Semi code</span>
              <span>Wins</span>
              <span>Issued semi promo</span>
            </div>

            {semiCodes.map((semiCode) => (
              <AdminCrackSafeSnapshotSemiWinningCodeRow
                key={semiCode.code}
                semiCode={semiCode}
                usedPromoCodes={usedPromoCodes}
              />
            ))}
          </div>
        ) : (
          <p className="admin-crack-safe-snapshot-details__pending-jackpot">
            Safe code and semi codes are not activated yet.
          </p>
        )}
      </div>

      {expiredPromoCodes.length ? (
        <fieldset className="admin-crack-safe-snapshot-details__expired-semi-promo">
          <legend>Expired promo</legend>
          <div>
            {expiredPromoCodes.map((promoCode, index) => (
              <Badge key={`${promoCode}-${index}`} variant="danger">
                {promoCode}
              </Badge>
            ))}
          </div>
        </fieldset>
      ) : null}
    </details>
  );
}
