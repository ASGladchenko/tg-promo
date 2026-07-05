import type { ComponentPropsWithRef } from "react";

import clsx from "clsx";

import "./checkbox-base.scss";

export type CheckboxBaseProps = Omit<ComponentPropsWithRef<"input">, "type">;

export function CheckboxBase({ className, ...props }: CheckboxBaseProps) {
  return <input {...props} type="checkbox" className={clsx("checkbox-base", className)} />;
}
