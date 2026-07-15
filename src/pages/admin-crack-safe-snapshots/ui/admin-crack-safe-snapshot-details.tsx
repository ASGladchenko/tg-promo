import { useParams } from "react-router";

import { useCrackSafeHistory } from "@/entities/crack-safe-history";
import { useCrackSafeSnapshotCodes, useCrackSafeSnapshots } from "@/entities/crack-safe-snapshots";
import { APP_ROUTES } from "@/shared/config";
import { getErrorMessage } from "@/shared/lib/error";
import { AdminPageHeader } from "@/shared/ui/admin-page-header";

import {
  getAdminCrackSafeSnapshotSemiCodes,
  getAdminCrackSafeSnapshotUnmatchedSemiWins
} from "../lib/get-admin-crack-safe-snapshot-semi-codes";
import { getAdminCrackSafeSnapshotUsedPromoCodes } from "../lib/get-admin-crack-safe-snapshot-used-promo-codes";
import { AdminCrackSafeSnapshotOverview } from "./admin-crack-safe-snapshot-overview";
import { AdminCrackSafeSnapshotPrizeCodes } from "./admin-crack-safe-snapshot-prize-codes";
import { AdminCrackSafeSnapshotSchedule } from "./admin-crack-safe-snapshot-schedule";

import "./admin-crack-safe-snapshot-details.scss";

export function AdminCrackSafeSnapshotDetails() {
  const { gameDate } = useParams();
  const historyQuery = useCrackSafeHistory();
  const snapshotCodesQuery = useCrackSafeSnapshotCodes(gameDate);
  const snapshotsQuery = useCrackSafeSnapshots();

  const snapshot = snapshotsQuery.data?.find((item) => item.gameDate === gameDate);

  const usedPromoCodes = snapshot
    ? getAdminCrackSafeSnapshotUsedPromoCodes(snapshot, snapshotCodesQuery.data)
    : {
        expiredJackpot: new Set<string>(),
        expiredSemiJackpot: new Set<string>(),
        jackpot: new Set<string>(),
        semiJackpot: new Set<string>()
      };
  const jackpotCodes = [...(snapshotCodesQuery.data ?? [])].sort(
    (left, right) => left.sequence - right.sequence
  );
  const semiCodeGroups = snapshot
    ? getAdminCrackSafeSnapshotSemiCodes(snapshot, jackpotCodes, historyQuery.data)
    : [];
  const unmatchedSemiWins = snapshot
    ? getAdminCrackSafeSnapshotUnmatchedSemiWins(snapshot, semiCodeGroups, historyQuery.data)
    : [];
  const semiJackpotWinsCount = (historyQuery.data ?? []).filter(
    (item) => item.gameDate === snapshot?.gameDate && item.outcome === "semi_jackpot"
  ).length;

  const snapshotsErrorMessage = getErrorMessage(
    snapshotsQuery.error,
    "Unknown Crack Safe snapshot loading error"
  );

  const snapshotCodesErrorMessage = getErrorMessage(
    snapshotCodesQuery.error,
    "Unknown Crack Safe snapshot codes loading error"
  );

  return (
    <section className="admin-crack-safe-snapshot-details">
      <AdminPageHeader
        backTo={`${APP_ROUTES.admin}/${APP_ROUTES.adminCrackSafeSnapshots}`}
        title="Crack Safe Snapshot"
      />

      {snapshotsQuery.isLoading ? (
        <p className="admin-crack-safe-snapshot-details__state" aria-live="polite">
          Loading Crack Safe snapshot...
        </p>
      ) : null}

      {snapshotsQuery.isError ? (
        <p
          className="admin-crack-safe-snapshot-details__state admin-crack-safe-snapshot-details__state--error"
          role="alert"
        >
          Failed to load Crack Safe snapshot. {snapshotsErrorMessage}
        </p>
      ) : null}

      {snapshotCodesQuery.isError ? (
        <p
          className="admin-crack-safe-snapshot-details__state admin-crack-safe-snapshot-details__state--error"
          role="alert"
        >
          Failed to load Crack Safe snapshot codes. Used promo codes are not marked.{" "}
          {snapshotCodesErrorMessage}
        </p>
      ) : null}

      {!snapshotsQuery.isLoading && snapshotsQuery.data && !snapshot ? (
        <p className="admin-crack-safe-snapshot-details__state">Crack Safe snapshot not found</p>
      ) : null}

      {snapshot ? (
        <>
          <AdminCrackSafeSnapshotOverview semiJackpotWinsCount={semiJackpotWinsCount} snapshot={snapshot} />

          <div className="admin-crack-safe-snapshot-details__grid">
            <AdminCrackSafeSnapshotPrizeCodes
              safeCodesCount={snapshotCodesQuery.data?.length ?? 0}
              semiCodeGroups={semiCodeGroups}
              unmatchedSemiWins={unmatchedSemiWins}
              usedPromoCodes={usedPromoCodes}
            />
            <AdminCrackSafeSnapshotSchedule snapshot={snapshot} />
          </div>
        </>
      ) : null}
    </section>
  );
}
