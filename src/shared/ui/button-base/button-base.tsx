import clsx from "clsx";

import "./button-base.scss";

export function ButtonBase({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={clsx("button-base", props.className)}>
      {children}
    </button>
  );
}
