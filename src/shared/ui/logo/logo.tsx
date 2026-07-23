import { useTranslation } from "react-i18next";

import LogoSvg from "@/shared/svg/logo.svg?react";

import "./logo.scss";

type BaseLogoProps = {
  ariaLabel?: string;
  className?: string;
};
type LogoAsLinkProps = BaseLogoProps & {
  as: "link";
  href: string;
};
type LogoAsButtonProps = BaseLogoProps & {
  as: "button";
  onClick: () => void;
};
type LogoProps = LogoAsLinkProps | LogoAsButtonProps;

function joinClassName(className?: string) {
  return className ? `logo ${className}` : "logo";
}

export function Logo(props: LogoProps) {
  const { t } = useTranslation();
  const ariaLabel = props.ariaLabel ?? t("brand.logoLabel");

  if (props.as === "link") {
    return (
      <a
        className={joinClassName(props.className)}
        href={props.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={ariaLabel}
      >
        <LogoSvg className="logo" />
      </a>
    );
  }

  return (
    <button
      className={joinClassName(props.className)}
      type="button"
      onClick={props.onClick}
      aria-label={ariaLabel}
    >
      <LogoSvg className="logo" />
    </button>
  );
}
