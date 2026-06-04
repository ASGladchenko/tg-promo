"use client";

import Modal from "@/shared/ui/modal";
import LockIcon from "@/shared/svg/lock.svg?react";
import UnlockIcon from "@/shared/svg/un-lock.svg?react";
import { useLotteryStore } from "../model/lottery-store";
import LotteryCodePicker from "./lottery-code-picker";

type LotteryCodePanelProps = {
  hideSelectedDigitsFromOtherColumns?: boolean;
};

function triggerCodeHapticFeedback() {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("soft");
}

function triggerLockHapticFeedback() {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("rigid");
}

function triggerErrorHapticFeedback() {
  const hapticFeedback = window.Telegram?.WebApp?.HapticFeedback;

  if (!hapticFeedback) {
    navigator.vibrate?.([40, 30, 40]);
    return;
  }

  hapticFeedback.impactOccurred?.("heavy");
  window.setTimeout(() => {
    hapticFeedback.notificationOccurred?.("error");
  }, 60);
}

export default function LotteryCodePanel({
  hideSelectedDigitsFromOtherColumns = false,
}: LotteryCodePanelProps) {
  const digits = useLotteryStore((state) => state.codeDigits);
  const isPickerOpen = useLotteryStore((state) => state.isCodePickerOpen);
  const activeIndex = useLotteryStore((state) => state.activeCodeIndex);
  const hasSubmitAttempt = useLotteryStore((state) => state.hasSubmitAttempt);
  const isCodeLocked = useLotteryStore((state) => state.isCodeLocked);
  const openCodePicker = useLotteryStore((state) => state.openCodePicker);
  const closeCodePicker = useLotteryStore((state) => state.closeCodePicker);
  const setCodeDigit = useLotteryStore((state) => state.setCodeDigit);
  const lockCodeInStore = useLotteryStore((state) => state.lockCode);
  const hasMissingDigits = digits.some((digit) => !digit);
  const code = digits.join("");

  function openPicker(index: number) {
    openCodePicker(index);
  }

  function updateDigit(index: number, digit: string) {
    const didUpdate = setCodeDigit(index, digit, { hideSelectedDigitsFromOtherColumns });

    if (didUpdate) {
      triggerCodeHapticFeedback();
    }
  }

  function lockCode() {
    const didLock = lockCodeInStore();

    if (!didLock) {
      triggerErrorHapticFeedback();
      return;
    }

    triggerLockHapticFeedback();
  }

  return (
    <div className="lottery-code-panel" dir="ltr" aria-label="Введите 3 цифры кода">
      <div className="lottery-code-panel__slots">
        {digits.map((digit, index) => {
          const isActive = !isCodeLocked && isPickerOpen && activeIndex === index;
          const isInvalid = hasSubmitAttempt && !digit;
          const slotClassName = [
            "lottery-code-panel__slot",
            digit ? "lottery-code-panel__slot--filled" : "",
            isActive ? "lottery-code-panel__slot--active" : "",
            isCodeLocked ? "lottery-code-panel__slot--locked" : "",
            isInvalid ? "lottery-code-panel__slot--invalid" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              className={slotClassName}
              key={index}
              type="button"
              aria-label={`Выбрать цифру ${index + 1}${isCodeLocked ? ", код зафиксирован" : ""}`}
              disabled={isCodeLocked}
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
          className={[
            "lottery-code-panel__lock-button",
            isCodeLocked ? "lottery-code-panel__lock-button--locked" : "",
            hasSubmitAttempt && hasMissingDigits ? "lottery-code-panel__lock-button--invalid" : ""
          ]
            .filter(Boolean)
            .join(" ")}
          type="button"
          disabled={isCodeLocked}
          aria-label={isCodeLocked ? `Код ${code} зафиксирован` : "Зафиксировать код"}
          onClick={(event) => {
            event.stopPropagation();
            lockCode();
          }}
        >
          {isCodeLocked ? <LockIcon aria-hidden="true" /> : <UnlockIcon aria-hidden="true" />}
        </button>
      </div>

      <Modal
        isOpen={isPickerOpen}
        onClose={closeCodePicker}
        ariaLabel="Выбор трех цифр кода"
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
