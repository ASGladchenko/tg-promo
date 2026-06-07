import clsx from "clsx";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./lottery-code-picker.scss";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const EMPTY_DIGIT = "";
const PICKER_OPTIONS = [EMPTY_DIGIT, ...DIGITS];

type LotteryCodePickerProps = {
  digits: string[];
  activeIndex: number | null;
  hideSelectedDigitsFromOtherColumns?: boolean;
  onAccept: () => void;
  onDigitChange: (index: number, digit: string) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAvailableDigits(
  columnIndex: number,
  sourceDigits: string[],
  hideSelectedDigitsFromOtherColumns: boolean
) {
  if (!hideSelectedDigitsFromOtherColumns) {
    return PICKER_OPTIONS;
  }

  const hiddenDigits = new Set(
    sourceDigits.filter((digit, digitIndex) => digitIndex !== columnIndex && Boolean(digit))
  );
  return PICKER_OPTIONS.filter((digit) => digit === EMPTY_DIGIT || !hiddenDigits.has(digit));
}

export function LotteryCodePicker({
  digits,
  activeIndex,
  hideSelectedDigitsFromOtherColumns = false,
  onAccept,
  onDigitChange
}: LotteryCodePickerProps) {
  const { t } = useTranslation();
  const columnRefs = useRef<Array<HTMLDivElement | null>>([]);
  const initialDigitsRef = useRef(digits);
  const isSyncingScrollRef = useRef(false);

  const getColumnStep = useCallback((column: HTMLDivElement) => {
    const digitButtons = column.querySelectorAll<HTMLButtonElement>(".lottery-code-picker__digit");
    const firstDigit = digitButtons[0];
    const secondDigit = digitButtons[1];

    if (!firstDigit) {
      return 1;
    }

    return secondDigit ? secondDigit.offsetTop - firstDigit.offsetTop : firstDigit.offsetHeight;
  }, []);

  const scrollColumnToDigit = useCallback(
    (columnIndex: number, digitIndex: number, behavior: ScrollBehavior = "auto") => {
      const column = columnRefs.current[columnIndex];

      if (!column) {
        return;
      }

      column.scrollTo({
        top: getColumnStep(column) * digitIndex,
        behavior
      });
    },
    [getColumnStep]
  );

  useLayoutEffect(() => {
    isSyncingScrollRef.current = true;

    initialDigitsRef.current.forEach((digit, columnIndex) => {
      const visibleDigits = getAvailableDigits(
        columnIndex,
        initialDigitsRef.current,
        hideSelectedDigitsFromOtherColumns
      );
      const visibleDigit = visibleDigits.includes(digit) ? digit : visibleDigits[0];
      const digitIndex = Math.max(visibleDigits.indexOf(visibleDigit), 0);
      scrollColumnToDigit(columnIndex, digitIndex);
    });

    const timeoutId = window.setTimeout(() => {
      isSyncingScrollRef.current = false;
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hideSelectedDigitsFromOtherColumns, scrollColumnToDigit]);

  useLayoutEffect(() => {
    if (isSyncingScrollRef.current) {
      return;
    }

    digits.forEach((digit, columnIndex) => {
      const column = columnRefs.current[columnIndex];

      if (!column) {
        return;
      }

      const visibleDigits = getAvailableDigits(columnIndex, digits, hideSelectedDigitsFromOtherColumns);
      const selectedDigit = visibleDigits.includes(digit) ? digit : visibleDigits[0];
      const selectedIndex = Math.max(visibleDigits.indexOf(selectedDigit), 0);
      const currentIndex = clamp(
        Math.round(column.scrollTop / getColumnStep(column)),
        0,
        visibleDigits.length - 1
      );

      if (currentIndex !== selectedIndex) {
        scrollColumnToDigit(columnIndex, selectedIndex);
      }
    });
  }, [digits, getColumnStep, hideSelectedDigitsFromOtherColumns, scrollColumnToDigit]);

  function handleScroll(columnIndex: number) {
    if (isSyncingScrollRef.current) {
      return;
    }

    const column = columnRefs.current[columnIndex];

    if (!column) {
      return;
    }

    const visibleDigits = getAvailableDigits(columnIndex, digits, hideSelectedDigitsFromOtherColumns);
    const digitIndex = clamp(
      Math.round(column.scrollTop / getColumnStep(column)),
      0,
      visibleDigits.length - 1
    );
    onDigitChange(columnIndex, visibleDigits[digitIndex]);
  }

  function handleDigitClick(columnIndex: number, digitIndex: number) {
    const visibleDigits = getAvailableDigits(columnIndex, digits, hideSelectedDigitsFromOtherColumns);
    onDigitChange(columnIndex, visibleDigits[digitIndex]);
    scrollColumnToDigit(columnIndex, digitIndex, "smooth");
  }

  return (
    <div className="lottery-code-picker">
      <div className="lottery-code-picker__viewport" aria-label={t("lottery.chooseCodeDigits")}>
        {Array.from({ length: 3 }, (_, columnIndex) => {
          const visibleDigits = getAvailableDigits(columnIndex, digits, hideSelectedDigitsFromOtherColumns);
          const selectedDigit = visibleDigits.includes(digits[columnIndex])
            ? digits[columnIndex]
            : visibleDigits[0];

          return (
            <div
              className={clsx("lottery-code-picker__column", {
                "lottery-code-picker__column--active": activeIndex === columnIndex
              })}
              key={columnIndex}
              ref={(node) => {
                columnRefs.current[columnIndex] = node;
              }}
              aria-label={t("lottery.digitPosition", { position: columnIndex + 1 })}
              onScroll={() => handleScroll(columnIndex)}
            >
              <span className="lottery-code-picker__spacer" aria-hidden="true" />
              {visibleDigits.map((digit, digitIndex) => (
                <button
                  className={clsx("lottery-code-picker__digit", {
                    "lottery-code-picker__digit--selected": selectedDigit === digit
                  })}
                  key={digit}
                  type="button"
                  aria-label={
                    digit
                      ? t("lottery.chooseDigit", { digit, position: columnIndex + 1 })
                      : t("lottery.clearPosition", { position: columnIndex + 1 })
                  }
                  aria-pressed={selectedDigit === digit}
                  onClick={() => handleDigitClick(columnIndex, digitIndex)}
                >
                  {digit || <span className="lottery-code-picker__empty-digit" aria-hidden="true" />}
                </button>
              ))}
              <span className="lottery-code-picker__spacer" aria-hidden="true" />
            </div>
          );
        })}
      </div>
      <div className="lottery-code-picker__selection-frame" aria-hidden="true" />
      <button className="lottery-code-picker__accept-button" type="button" onClick={onAccept}>
        {t("lottery.accept")}
      </button>
    </div>
  );
}
