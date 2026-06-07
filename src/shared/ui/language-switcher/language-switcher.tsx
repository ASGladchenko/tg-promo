import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { ArabicFlag, EnglishFlag, FrenchFlag } from "@/shared/images/flag";
import {
  applyLocale,
  getDefaultLocale,
  getSupportedLocale,
  storeLocale,
  type SupportedLocale
} from "@/shared/lib/i18n";

import "./language-switcher.scss";

type LanguageMetadata = {
  code: string;
  direction: "ltr" | "rtl";
  flagSrc: string;
  label: string;
  locale: SupportedLocale;
  order: number;
};

const LANGUAGE_METADATA: Record<SupportedLocale, LanguageMetadata> = {
  ar: {
    code: "AR",
    direction: "rtl",
    flagSrc: ArabicFlag,
    label: "العربية",
    locale: "ar",
    order: 0
  },
  en: {
    code: "EN",
    direction: "ltr",
    flagSrc: EnglishFlag,
    label: "English",
    locale: "en",
    order: 2
  },
  fr: {
    code: "FR",
    direction: "ltr",
    flagSrc: FrenchFlag,
    label: "Français",
    locale: "fr",
    order: 1
  }
};

const LANGUAGE_OPTIONS = Object.values(LANGUAGE_METADATA).sort((left, right) => left.order - right.order);

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openingFocusIndexRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const activeLocale = getSupportedLocale(i18n.resolvedLanguage ?? i18n.language) ?? getDefaultLocale();
  const selectedIndex = LANGUAGE_OPTIONS.findIndex((option) => option.locale === activeLocale);
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex);
  const activeLanguage = LANGUAGE_METADATA[activeLocale];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !rootRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const nextIndex = openingFocusIndexRef.current ?? (selectedIndex >= 0 ? selectedIndex : 0);
    openingFocusIndexRef.current = null;
    setFocusedIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }, [isOpen, selectedIndex]);

  function openMenu(focusIndex: number) {
    openingFocusIndexRef.current = focusIndex;
    setFocusedIndex(focusIndex);
    setIsOpen(true);
  }

  function closeMenu(shouldRestoreFocus = false) {
    setIsOpen(false);

    if (shouldRestoreFocus) {
      triggerRef.current?.focus();
    }
  }

  function focusOption(index: number) {
    const normalizedIndex = (index + LANGUAGE_OPTIONS.length) % LANGUAGE_OPTIONS.length;
    setFocusedIndex(normalizedIndex);
    optionRefs.current[normalizedIndex]?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(0);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(LANGUAGE_OPTIONS.length - 1);
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusOption(focusedIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusOption(focusedIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusOption(0);
        break;
      case "End":
        event.preventDefault();
        focusOption(LANGUAGE_OPTIONS.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  }

  function selectLanguage(locale: SupportedLocale) {
    storeLocale(locale);
    closeMenu(true);
    void applyLocale(locale);
  }

  return (
    <div ref={rootRef} className="language-switcher" dir="ltr">
      <button
        ref={triggerRef}
        className="language-switcher__trigger"
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`${t("languageSwitcher.changeLanguage")}: ${activeLanguage.label}`}
        onClick={() => {
          if (isOpen) {
            closeMenu();
            return;
          }

          openMenu(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <img
          className="language-switcher__trigger-flag"
          src={activeLanguage.flagSrc}
          alt=""
          aria-hidden="true"
        />
        <span className="language-switcher__trigger-code">{activeLanguage.code}</span>
      </button>

      {isOpen ? (
        <div
          id={menuId}
          className="language-switcher__menu"
          role="menu"
          aria-label={t("languageSwitcher.menuLabel")}
          onKeyDown={handleMenuKeyDown}
        >
          {LANGUAGE_OPTIONS.map((option, index) => {
            const isSelected = option.locale === activeLocale;

            return (
              <button
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                className="language-switcher__option"
                key={option.locale}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={focusedIndex === index ? 0 : -1}
                onClick={() => selectLanguage(option.locale)}
                onFocus={() => setFocusedIndex(index)}
              >
                <img
                  className="language-switcher__option-flag"
                  src={option.flagSrc}
                  alt=""
                  aria-hidden="true"
                />
                <span className="language-switcher__option-label" dir={option.direction}>
                  {option.label}
                </span>
                <span
                  className={clsx("language-switcher__radio", {
                    "language-switcher__radio--selected": isSelected
                  })}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
