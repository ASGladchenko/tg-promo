import clsx from "clsx";

import "./badge.scss";

export type BadgeVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "light" | "dark";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  isStruck?: boolean;
  variant?: BadgeVariant;
};

export function Badge({
  children,
  className,
  isStruck = false,
  variant = "secondary",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={clsx(
        "badge",
        `badge--${variant}`,
        {
          "badge--struck": isStruck
        },
        className
      )}
    >
      {children}
    </span>
  );
}
