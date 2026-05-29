"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { spinWheelOnCodeInput } from "../model/wheel-spin-bridge";

const CODE_LENGTH = 4;
const RTL_LANGUAGE_PREFIXES = ["ar", "fa", "he", "ur"];

type TextDirection = "ltr" | "rtl";

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

function detectTextDirection(language: string): TextDirection {
  const normalizedLanguage = language.toLowerCase();
  const isRtl = RTL_LANGUAGE_PREFIXES.some((prefix) => normalizedLanguage.startsWith(prefix));

  return isRtl ? "rtl" : "ltr";
}

function getPreferredLanguage() {
  return (
    window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code ||
    document.documentElement.lang ||
    navigator.language ||
    "en"
  );
}

export default function LotteryCodePanel() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [direction, setDirection] = useState<TextDirection>("ltr");
  const [isFocused, setIsFocused] = useState(false);
  const activeIndex = code.length < CODE_LENGTH ? code.length : null;
  const digits = useMemo(() => Array.from({ length: CODE_LENGTH }, (_, index) => code[index] ?? ""), [code]);

  useEffect(() => {
    setDirection(detectTextDirection(getPreferredLanguage()));
  }, []);

  function focusInput() {
    inputRef.current?.focus();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextCode = normalizeCodeInput(event.currentTarget.value);

    setCode((previousCode) => {
      if (nextCode !== previousCode) {
        spinWheelOnCodeInput();
      }

      return nextCode;
    });
  }

  return (
    <div
      className="lottery-code-panel"
      dir={direction}
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
        onBlur={() => setIsFocused(false)}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
      />

      <div className="lottery-code-panel__slots">
        {digits.map((digit, index) => {
          const isActive = isFocused && activeIndex === index;
          const slotClassName = [
            "lottery-code-panel__slot",
            digit ? "lottery-code-panel__slot--filled" : "",
            isActive ? "lottery-code-panel__slot--active" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              className={slotClassName}
              key={index}
              type="button"
              aria-label={`Цифра ${index + 1}`}
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
      </div>
    </div>
  );
}
