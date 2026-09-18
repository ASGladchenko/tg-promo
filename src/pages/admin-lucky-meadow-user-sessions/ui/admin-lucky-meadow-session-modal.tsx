import { LuckyMeadowSnapshotBoard, useLuckyMeadowUserSession } from "@/entities/lucky-meadow";
import { getErrorMessage } from "@/shared/lib/error";
import { ButtonBase } from "@/shared/ui/button-base";
import { Modal } from "@/shared/ui/modal";

import "./admin-lucky-meadow-session-modal.scss";

type AdminLuckyMeadowSessionModalProps = {
  onClose: () => void;
  startDate: string | undefined;
  userId: string | undefined;
  userSnapshotId: string | null;
};

export function AdminLuckyMeadowSessionModal({
  onClose,
  startDate,
  userId,
  userSnapshotId
}: AdminLuckyMeadowSessionModalProps) {
  const sessionQuery = useLuckyMeadowUserSession(startDate, userId, userSnapshotId);
  const errorMessage = getErrorMessage(sessionQuery.error, "Unknown Lucky Meadow session loading error");

  return (
    <Modal
      ariaLabel="Lucky Meadow session field"
      className="session-modal"
      hasOverlay
      isOpen={userSnapshotId !== null}
      onClose={onClose}
    >
      <div className="session-modal__header">
        <div>
          <p className="session-modal__eyebrow">User session</p>
          <h2 className="session-modal__title">Lucky Meadow field</h2>
        </div>
        <ButtonBase aria-label="Close session field" onClick={onClose} type="button" variant="dark">
          Close
        </ButtonBase>
      </div>

      {userSnapshotId ? (
        <code className="session-modal__id" title={userSnapshotId}>
          {userSnapshotId}
        </code>
      ) : null}

      {sessionQuery.isLoading ? (
        <p className="session-modal__state" aria-live="polite">
          Loading field...
        </p>
      ) : null}

      {sessionQuery.isError && !sessionQuery.data ? (
        <div className="session-modal__state session-modal__state--error" role="alert">
          <p>Failed to load field. {errorMessage}</p>
          <ButtonBase onClick={() => void sessionQuery.refetch()} type="button" variant="primary">
            Retry
          </ButtonBase>
        </div>
      ) : null}

      {sessionQuery.data ? (
        <>
          <div className="session-modal__meta">
            <span>Status: {sessionQuery.data.status}</span>
            <span>Outcome: {sessionQuery.data.finalOutcome ?? "—"}</span>
            <span>
              Period: {sessionQuery.data.startDate} — {sessionQuery.data.endDate}
            </span>
          </div>
          <LuckyMeadowSnapshotBoard cells={sessionQuery.data.cells} />
        </>
      ) : null}
    </Modal>
  );
}
