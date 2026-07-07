import type { ComponentPropsWithRef } from "react";

import clsx from "clsx";

import "./textarea-base.scss";

export type TextareaBaseProps = ComponentPropsWithRef<"textarea">;

export function TextareaBase({ className, ...props }: TextareaBaseProps) {
  return (
    <textarea {...props} className={clsx("textarea-base", "admin-textarea-hover-scrollbar", className)} />
  );
}
