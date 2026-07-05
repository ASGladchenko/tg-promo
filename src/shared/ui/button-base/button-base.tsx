import clsx from "clsx";

import "./button-base.scss";

export type ButtonBaseVariant = "default" | "primary" | "success" | "warning" | "danger" | "dark";

export interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  height?: number | string;
  variant?: ButtonBaseVariant;
}

export function ButtonBase({ children, className, height, style, variant = "default", ...props }: ButtonBaseProps) {
  const buttonStyle = {
    ...style,
    "--button-base-height": typeof height === "number" ? `${height}px` : height
  } as React.CSSProperties;

  return (
    <button
      {...props}
      style={buttonStyle}
      className={clsx("button-base", variant !== "default" && `button-base--${variant}`, className)}
    >
      {children}
    </button>
  );
}
