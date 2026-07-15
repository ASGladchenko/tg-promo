import clsx from "clsx";

type AdminCrackSafeSnapshotJackpotPromoCodesProps = {
  promoCodes: string[];
  usedPromoCodes: Set<string>;
};

export function AdminCrackSafeSnapshotJackpotPromoCodes({
  promoCodes,
  usedPromoCodes
}: AdminCrackSafeSnapshotJackpotPromoCodesProps) {
  return (
    <code>
      {promoCodes.map((promoCode) => (
        <span
          className={clsx("admin-crack-safe-snapshot-details__promo-code", {
            "admin-crack-safe-snapshot-details__promo-code--used": usedPromoCodes.has(promoCode)
          })}
          key={promoCode}
        >
          {promoCode}
        </span>
      ))}
    </code>
  );
}
