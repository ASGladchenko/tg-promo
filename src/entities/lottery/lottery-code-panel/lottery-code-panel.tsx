"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import LockIcon from "@/shared/svg/lock.svg?react";
import UnlockIcon from "@/shared/svg/un-lock.svg?react";
import { spinWheelOnCodeInput } from "../model/wheel-spin-bridge";

const CODE_LENGTH = 4;

function normalizeDigit(char: string) {
  const charCode = char.charCodeAt(0);

  if (charCode >= 48 && charCode <= 57) {
    return char;
  }

  if (charCode >= 0x0660 && charCode <= 0x0669) {
    return String(charCode - 0x0660);
  }

  if (charCode >= 0x06f0 && charCode <= 0x06f9) {
    return String(charCode - 0x06f0);
  }

  return "";
}

function normalizeCodeInput(value: string) {
  return Array.from(value).map(normalizeDigit).join("").slice(0, CODE_LENGTH);
}

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

export default function LotteryCodePanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  const activeIndex = code.length < CODE_LENGTH ? code.length : null;
  const digits = useMemo(() => Array.from({ length: CODE_LENGTH }, (_, index) => code[index] ?? ""), [code]);
  const hasMissingDigits = code.length < CODE_LENGTH;

  function focusInput() {
    if (isCodeLocked) {
      return;
    }

    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (isCodeLocked) {
      return;
    }

    const nextCode = normalizeCodeInput(event.currentTarget.value);

    setCode((previousCode) => {
      if (nextCode !== previousCode) {
        setHasSubmitAttempt(false);
        spinWheelOnCodeInput();
        triggerCodeHapticFeedback();
      }

      return nextCode;
    });
  }

  function lockCode() {
    if (isCodeLocked) {
      return;
    }

    if (hasMissingDigits) {
      setHasSubmitAttempt(true);
      triggerErrorHapticFeedback();
      return;
    }

    setIsCodeLocked(true);
    setIsFocused(false);
    inputRef.current?.blur();
    triggerLockHapticFeedback();
  }

  return (
    <div
      className="lottery-code-panel"
      dir="ltr"
      aria-label="Введите 4 цифры кода"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        className="lottery-code-panel__input"
        value={code}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        enterKeyHint="done"
        aria-label="Код из 4 цифр"
        disabled={isCodeLocked}
        onBlur={() => setIsFocused(false)}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
      />

      <div className="lottery-code-panel__slots">
        {digits.map((digit, index) => {
          const isActive = !isCodeLocked && isFocused && activeIndex === index;
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
              aria-label={`Цифра ${index + 1}${isCodeLocked ? ", зафиксирована" : ""}`}
              disabled={isCodeLocked}
              onClick={focusInput}
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
    </div>
  );
}
