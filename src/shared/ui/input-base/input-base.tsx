import clsx from "clsx";

import "./input-base.scss";

export interface InputBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputBase({ type = "text", onChange, className, ...props }: InputBaseProps) {
  return (
    <input
      {...props}
      type={type}
      className={clsx("input-base", className)}
      onChange={(e) => onChange?.(e.target.value, e)}
    />
  );
}
