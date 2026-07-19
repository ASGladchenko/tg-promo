import clsx from "clsx";

import "./button-base.scss";

export type ButtonBaseVariant = "default" | "primary" | "success" | "warning" | "danger" | "dark";
export type ButtonBaseAppearance = "solid" | "outline";

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonBaseAppearance;
  height?: number | string;
  variant?: ButtonBaseVariant;
}

export function ButtonBase({
  appearance = "solid",
  children,
  className,
  height,
  style,
  variant = "default",
  ...props
}: ButtonBaseProps) {
  const buttonStyle = {
    ...style,
    "--button-base-height": typeof height === "number" ? `${height}px` : height
  } as React.CSSProperties;

  return (
    <button
      {...props}
      style={buttonStyle}
      className={clsx(
        "button-base",
        variant !== "default" && `button-base--${variant}`,
        appearance === "outline" && "button-base--outline",
        className
      )}
    >
      {children}
    </button>
  );
}
