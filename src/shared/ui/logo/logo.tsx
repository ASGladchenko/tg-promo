import "./logo.scss";

type BaseLogoProps = {
  className?: string;
  ariaLabel?: string;
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
  const ariaLabel = props.ariaLabel ?? "Logo label";

  if (props.as === "link") {
    return (
      <a
        className={joinClassName(props.className)}
        href={props.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={ariaLabel}
      >
        Abidas
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
      Abidas
    </button>
  );
}
