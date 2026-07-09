import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { triggerErrorHapticFeedback, triggerSoftHapticFeedback } from "@/shared/lib/telegram";
import Play from "@/shared/svg/play.svg?react";
import { Modal } from "@/shared/ui/modal";

import { useLotteryStore } from "../../model/lottery-store";
import { LotteryCodePicker } from "../lottery-code-picker";

import "./lottery-code-panel.scss";

type LotteryCodePanelProps = {
  hideSelectedDigitsFromOtherColumns?: boolean;
  isChecking?: boolean;
  isInteractionDisabled?: boolean;
  onCheck: (digits: string[]) => void;
  onCodeChange?: () => void;
};

export function LotteryCodePanel({
  hideSelectedDigitsFromOtherColumns = false,
  isChecking = false,
  isInteractionDisabled = false,
  onCheck,
  onCodeChange
}: LotteryCodePanelProps) {
  const { t } = useTranslation();
  const digits = useLotteryStore((state) => state.codeDigits);
  const isPickerOpen = useLotteryStore((state) => state.isCodePickerOpen);
  const activeIndex = useLotteryStore((state) => state.activeCodeIndex);
  const hasSubmitAttempt = useLotteryStore((state) => state.hasSubmitAttempt);
  const isCodeLocked = useLotteryStore((state) => state.isCodeLocked);
  const openCodePicker = useLotteryStore((state) => state.openCodePicker);
  const closeCodePicker = useLotteryStore((state) => state.closeCodePicker);
  const setCodeDigit = useLotteryStore((state) => state.setCodeDigit);
  const submitCodeInStore = useLotteryStore((state) => state.submitCode);
  const hasMissingDigits = digits.some((digit) => !digit);
  const code = digits.join("");
  const isPanelLocked = isCodeLocked || isInteractionDisabled;
  const isInputDisabled = isPanelLocked || isChecking;

  function openPicker(index: number) {
    if (isInputDisabled) {
      return;
    }

    openCodePicker(index);
  }

  function updateDigit(index: number, digit: string) {
    if (isInputDisabled) {
      return;
    }

    const didUpdate = setCodeDigit(index, digit, { hideSelectedDigitsFromOtherColumns });

    if (didUpdate) {
      onCodeChange?.();
      triggerSoftHapticFeedback();
    }
  }

  function checkCode() {
    if (isInputDisabled) {
      return;
    }

    const didSubmit = submitCodeInStore();

    if (!didSubmit) {
      triggerErrorHapticFeedback();
      return;
    }

    onCheck([...digits]);
  }

  return (
    <div className="lottery-code-panel" aria-label={t("lottery.enterCode")}>
      <div className="lottery-code-panel__slots">
        {digits.map((digit, index) => {
          const isActive = !isPanelLocked && !isChecking && isPickerOpen && activeIndex === index;
          const isInvalid = hasSubmitAttempt && !digit;

          return (
            <button
              className={clsx("lottery-code-panel__slot", {
                "lottery-code-panel__slot--filled": digit,
                "lottery-code-panel__slot--active": isActive,
                "lottery-code-panel__slot--locked": isPanelLocked,
                "lottery-code-panel__slot--invalid": isInvalid
              })}
              key={index}
              type="button"
              aria-label={
                isInputDisabled
                  ? t("lottery.slotUnavailable", { position: index + 1 })
                  : t("lottery.chooseDigitPosition", { position: index + 1 })
              }
              disabled={isInputDisabled}
              onClick={() => openPicker(index)}
            >
              {digit ? (
                <span className="lottery-code-panel__digit">{digit}</span>
              ) : (
                <span className="lottery-code-panel__placeholder" />
              )}
            </button>
          );
        })}

        <button
          className={clsx("lottery-code-panel__lock-button", {
            "lottery-code-panel__lock-button--locked": isPanelLocked,
            "lottery-code-panel__lock-button--checking": isChecking,
            "lottery-code-panel__lock-button--invalid": hasSubmitAttempt && hasMissingDigits
          })}
          type="button"
          disabled={isInputDisabled}
          aria-label={isChecking ? t("lottery.checkingCode", { code }) : t("lottery.checkCode")}
          onClick={(event) => {
            event.stopPropagation();
            checkCode();
          }}
        >
          <Play />
        </button>
      </div>

      <Modal
        isOpen={isPickerOpen}
        onClose={closeCodePicker}
        ariaLabel={t("lottery.pickerDialog")}
        className="lottery-code-panel__picker-modal"
      >
        <LotteryCodePicker
          digits={digits}
          activeIndex={activeIndex}
          hideSelectedDigitsFromOtherColumns={hideSelectedDigitsFromOtherColumns}
          onAccept={closeCodePicker}
          onDigitChange={updateDigit}
        />
      </Modal>
    </div>
  );
}
