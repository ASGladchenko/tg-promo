import type { ComponentPropsWithRef } from "react";

import clsx from "clsx";

import "./input-base.scss";

export type InputBaseProps = ComponentPropsWithRef<"input">;

export function InputBase({ type = "text", className, ...props }: InputBaseProps) {
  return <input {...props} type={type} className={clsx("input-base", className)} />;
}
