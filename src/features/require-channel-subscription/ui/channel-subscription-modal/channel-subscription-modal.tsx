import { useTranslation } from "react-i18next";

import { Modal } from "@/shared/ui/modal";

import "./channel-subscription-modal.scss";

type ChannelSubscriptionModalProps = {
  canOpenChannel: boolean;
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenChannel: () => void;
};

export function ChannelSubscriptionModal({
  canOpenChannel,
  error,
  isLoading,
  isOpen,
  onClose,
  onOpenChannel
}: ChannelSubscriptionModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("subscription.dialogLabel")}
      className="channel-subscription-modal"
    >
      <div className="channel-subscription-modal__content">
        <h2 className="channel-subscription-modal__title">{t("subscription.title")}</h2>
        <p className="channel-subscription-modal__text">{t("subscription.text")}</p>

        {error ? <p className="channel-subscription-modal__error">{error}</p> : null}

        {canOpenChannel ? (
          <button
            className="channel-subscription-modal__button"
            type="button"
            disabled={isLoading}
            onClick={onOpenChannel}
          >
            {t("subscription.openChannel")}
          </button>
        ) : (
          <p className="channel-subscription-modal__error">{t("subscription.noChannelUrl")}</p>
        )}
      </div>
    </Modal>
  );
}
