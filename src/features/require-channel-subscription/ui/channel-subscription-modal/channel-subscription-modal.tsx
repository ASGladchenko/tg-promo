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
  onOpenChannel,
}: ChannelSubscriptionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Подписка на Telegram канал"
      className="channel-subscription-modal"
    >
      <div className="channel-subscription-modal__content">
        <h2 className="channel-subscription-modal__title">Подпишитесь на канал</h2>
        <p className="channel-subscription-modal__text">
          Чтобы продолжить, необходимо подписаться на Telegram-канал.
        </p>

        {error ? <p className="channel-subscription-modal__error">{error}</p> : null}

        {canOpenChannel ? (
          <button
            className="channel-subscription-modal__button"
            type="button"
            disabled={isLoading}
            onClick={onOpenChannel}
          >
            Открыть канал
          </button>
        ) : (
          <p className="channel-subscription-modal__error">
            Ссылка на канал не настроена. Попробуйте позже.
          </p>
        )}
      </div>
    </Modal>
  );
}
