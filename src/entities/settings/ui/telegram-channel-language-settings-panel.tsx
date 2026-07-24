import { useEffect, useId, useState } from "react";

import clsx from "clsx";

import { ArabicFlag, EnglishFlag, FrenchFlag } from "@/shared/images/flag";
import { getErrorMessage } from "@/shared/lib/error";
import { notify } from "@/shared/lib/toast";
import { ButtonBase } from "@/shared/ui/button-base";
import { ButtonLoading } from "@/shared/ui/button-loading";
import { Modal } from "@/shared/ui/modal";

import { type TelegramChannelLanguage } from "../model/types";
import { useTelegramChannelLanguageSettings } from "../model/use-telegram-channel-language-settings";
import { useUpdateTelegramChannelLanguage } from "../model/use-update-telegram-channel-language";

import "./telegram-channel-language-settings-panel.scss";

type ChannelLanguageMetadata = {
  code: string;
  direction: "ltr" | "rtl";
  flagSrc?: string;
  label: string;
  nativeLabel: string;
};

const KNOWN_LANGUAGE_METADATA: Record<string, ChannelLanguageMetadata> = {
  ar: {
    code: "AR",
    direction: "rtl",
    flagSrc: ArabicFlag,
    label: "Arabic",
    nativeLabel: "العربية"
  },
  en: {
    code: "EN",
    direction: "ltr",
    flagSrc: EnglishFlag,
    label: "English",
    nativeLabel: "English"
  },
  fr: {
    code: "FR",
    direction: "ltr",
    flagSrc: FrenchFlag,
    label: "French",
    nativeLabel: "Français"
  }
};

function getChannelLanguageMetadata(language: TelegramChannelLanguage): ChannelLanguageMetadata {
  const normalizedLanguage = language.trim().toLowerCase();
  const knownMetadata = KNOWN_LANGUAGE_METADATA[normalizedLanguage];

  if (knownMetadata) {
    return knownMetadata;
  }

  return {
    code: normalizedLanguage.toUpperCase(),
    direction: "ltr",
    label: normalizedLanguage.toUpperCase(),
    nativeLabel: normalizedLanguage
  };
}

export function TelegramChannelLanguageSettingsPanel() {
  const titleId = useId();
  const settingsQuery = useTelegramChannelLanguageSettings();
  const updateLanguage = useUpdateTelegramChannelLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<TelegramChannelLanguage | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const settings = settingsQuery.data;
  const currentLanguage = settings?.language;
  const supportedLanguages = settings?.supportedLanguages ?? [];
  const isDirty =
    selectedLanguage !== undefined && currentLanguage !== undefined && selectedLanguage !== currentLanguage;
  const isActionDisabled = updateLanguage.isPending || selectedLanguage === undefined;
  const currentLanguageMetadata = currentLanguage ? getChannelLanguageMetadata(currentLanguage) : undefined;
  const queryErrorMessage = getErrorMessage(
    settingsQuery.error,
    "Unknown Telegram channel language loading error"
  );

  useEffect(() => {
    if (settings?.language) {
      setSelectedLanguage(settings.language);
    }
  }, [settings?.language]);

  const openLanguageModal = () => {
    setSelectedLanguage(currentLanguage);
    setIsModalOpen(true);
  };

  const closeLanguageModal = () => {
    if (updateLanguage.isPending) {
      return;
    }

    setSelectedLanguage(currentLanguage);
    setIsModalOpen(false);
  };

  const saveLanguage = async () => {
    if (!selectedLanguage || updateLanguage.isPending || !isDirty) {
      return;
    }

    try {
      await updateLanguage.mutateAsync({
        language: selectedLanguage
      });
      setIsModalOpen(false);
      notify.success("Telegram channel language updated");
    } catch (error) {
      notify.error(getErrorMessage(error, "Failed to update Telegram channel language"));
    }
  };

  return (
    <section className="channel-language" aria-labelledby={titleId}>
      <div className="channel-language__header">
        <div className="channel-language__heading">
          <p className="channel-language__eyebrow">Telegram channel</p>
          <h2 id={titleId} className="channel-language__title">
            Channel language
          </h2>
        </div>

        {currentLanguageMetadata ? (
          <span className="channel-language__current" aria-live="polite">
            Current: {currentLanguageMetadata.code}
          </span>
        ) : null}
      </div>

      {settingsQuery.isLoading ? (
        <p className="channel-language__state" aria-live="polite">
          Loading channel language...
        </p>
      ) : null}

      {settingsQuery.isError ? (
        <div className="channel-language__error" role="alert">
          <p className="channel-language__error-text">Failed to load channel language. {queryErrorMessage}</p>
          <ButtonBase
            type="button"
            appearance="outline"
            variant="danger"
            disabled={settingsQuery.isFetching}
            onClick={() => void settingsQuery.refetch()}
          >
            Retry
          </ButtonBase>
        </div>
      ) : null}

      {settings ? (
        <div className="channel-language__body">
          <div className="channel-language__summary">
            {currentLanguageMetadata ? (
              <div className="channel-language__selected">
                {currentLanguageMetadata.flagSrc ? (
                  <img
                    className="channel-language__mark"
                    src={currentLanguageMetadata.flagSrc}
                    alt=""
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className="channel-language__mark channel-language__mark--fallback"
                    aria-hidden="true"
                  >
                    {currentLanguageMetadata.code}
                  </span>
                )}

                <span className="channel-language__labels">
                  <span className="channel-language__label">{currentLanguageMetadata.label}</span>
                  <span className="channel-language__native" dir={currentLanguageMetadata.direction}>
                    {currentLanguageMetadata.nativeLabel}
                  </span>
                </span>
              </div>
            ) : null}

            <ButtonBase type="button" variant="primary" onClick={openLanguageModal}>
              Change
            </ButtonBase>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={closeLanguageModal}
        ariaLabel="Choose Telegram channel language"
        hasOverlay
        className="channel-language__modal"
      >
        <div className="channel-language__modal-header">
          <div>
            <p className="channel-language__eyebrow">Telegram channel</p>
            <h3 className="channel-language__modal-title">Choose language</h3>
          </div>
        </div>

        <div className="channel-language__options" role="group" aria-label="Telegram channel language">
          {supportedLanguages.map((language) => {
            const metadata = getChannelLanguageMetadata(language);
            const isSelected = language === selectedLanguage;

            return (
              <button
                key={language}
                type="button"
                aria-pressed={isSelected}
                disabled={updateLanguage.isPending}
                className={clsx("channel-language__option", {
                  "channel-language__option--selected": isSelected
                })}
                onClick={() => setSelectedLanguage(language)}
              >
                {metadata.flagSrc ? (
                  <img className="channel-language__mark" src={metadata.flagSrc} alt="" aria-hidden="true" />
                ) : (
                  <span
                    className="channel-language__mark channel-language__mark--fallback"
                    aria-hidden="true"
                  >
                    {metadata.code}
                  </span>
                )}

                <span className="channel-language__labels">
                  <span className="channel-language__label">{metadata.label}</span>
                  <span className="channel-language__native" dir={metadata.direction}>
                    {metadata.nativeLabel}
                  </span>
                </span>

                <span className="channel-language__code">{metadata.code}</span>
              </button>
            );
          })}
        </div>

        <div className="channel-language__footer">
          <div className="channel-language__actions">
            <ButtonBase
              type="button"
              variant="danger"
              disabled={updateLanguage.isPending}
              onClick={closeLanguageModal}
            >
              Cancel
            </ButtonBase>
            <ButtonLoading
              type="button"
              variant="primary"
              disabled={!isDirty || isActionDisabled}
              isLoading={updateLanguage.isPending}
              onClick={() => void saveLanguage()}
            >
              Save
            </ButtonLoading>
          </div>
        </div>
      </Modal>
    </section>
  );
}
