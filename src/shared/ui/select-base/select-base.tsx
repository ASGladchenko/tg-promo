import type { ComponentPropsWithRef } from "react";

import clsx from "clsx";

import "./select-base.scss";

export type SelectBaseProps = ComponentPropsWithRef<"button">;

export function SelectBase({ className, type = "button", ...props }: SelectBaseProps) {
  return <button {...props} type={type} className={clsx("select-base", className)} />;
}
