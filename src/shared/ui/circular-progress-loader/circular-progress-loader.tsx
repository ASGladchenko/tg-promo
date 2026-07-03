import { type ComponentPropsWithoutRef, type CSSProperties } from "react";

import clsx from "clsx";

import "./circular-progress-loader.scss";

type CircularProgressLoaderProps = Omit<
  ComponentPropsWithoutRef<"span">,
  "aria-hidden" | "aria-label" | "children" | "role"
> & {
  className?: string;
  color?: string;
  label?: string;
  size?: number | string;
};
type CircularProgressLoaderStyle = CSSProperties & {
  "--circular-progress-loader-fill"?: string;
  "--circular-progress-loader-size"?: string;
};

function normalizeLoaderSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

export function CircularProgressLoader({
  size,
  color,
  label,
  style,
  className,
  ...props
}: CircularProgressLoaderProps) {
  const loaderStyle: CircularProgressLoaderStyle = {
    ...style,
    ...(color ? { "--circular-progress-loader-fill": color } : {}),
    ...(size !== undefined ? { "--circular-progress-loader-size": normalizeLoaderSize(size) } : {})
  };

  return (
    <span
      {...props}
      aria-label={label}
      style={loaderStyle}
      aria-hidden={label ? undefined : true}
      role={label ? "progressbar" : undefined}
      className={clsx("circular-progress-loader", className)}
    >
      <svg className="circular-progress-loader__scale" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="circular-progress-loader__track" cx="24" cy="24" r="20" />
        <circle className="circular-progress-loader__indicator" cx="24" cy="24" r="20" />
      </svg>
    </span>
  );
}
